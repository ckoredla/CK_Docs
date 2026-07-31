import { searchRecords } from '../lib/articles';
export function GET() { return Response.json(searchRecords); }
