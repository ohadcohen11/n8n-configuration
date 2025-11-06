import { NextResponse } from 'next/server';
import { n8nClient } from '@/lib/n8n-client';

export async function GET() {
  try {
    const workflows = await n8nClient.getWorkflows();
    return NextResponse.json({ success: true, data: workflows });
  } catch (error) {
    console.error('Error fetching workflows:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch workflows'
      },
      { status: 500 }
    );
  }
}
