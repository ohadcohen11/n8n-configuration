import { NextResponse } from 'next/server';
import { n8nClient } from '@/lib/n8n-client';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const workflow = await n8nClient.getWorkflow(id);
    return NextResponse.json({ success: true, data: workflow });
  } catch (error) {
    console.error('Error fetching workflow:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch workflow'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const workflow = await n8nClient.updateWorkflow(id, body);
    return NextResponse.json({ success: true, data: workflow });
  } catch (error) {
    console.error('Error updating workflow:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update workflow'
      },
      { status: 500 }
    );
  }
}
