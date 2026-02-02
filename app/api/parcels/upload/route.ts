import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseCSV, validateParcels } from '@/lib/csv-parser';
import { getCurrentSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { user } = await getCurrentSession();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a CSV file.' },
        { status: 400 }
      );
    }

    // Read file content
    const content = await file.text();

    // Parse CSV
    const parseResult = parseCSV(content);
    
    if (!parseResult.success || !parseResult.data) {
      return NextResponse.json(
        { 
          error: 'Failed to parse CSV',
          details: parseResult.errors 
        },
        { status: 400 }
      );
    }

    // Validate parcels
    const validationErrors = validateParcels(parseResult.data);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationErrors 
        },
        { status: 400 }
      );
    }

    // Delete existing parcels for this user (replace strategy)
    await prisma.parcel.deleteMany({
      where: { userId: user.id }
    });

    // Create parcels in database
    const parcels = await prisma.parcel.createMany({
      data: parseResult.data.map(p => ({
        plotId: p.plot_id,
        ownerName: p.owner_name,
        areaRecord: p.area_record,
        userId: user.id
      }))
    });

    // Create changelog entry for bulk upload
    await prisma.changeLog.create({
      data: {
        userId: user.id,
        action: 'bulk_upload',
        description: `Uploaded ${parcels.count} parcels from CSV file: ${file.name}`,
        newValue: `${parcels.count} parcels`
      }
    });

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${parcels.count} parcels`,
      count: parcels.count
    });

  } catch (error) {
    console.error('CSV upload error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
