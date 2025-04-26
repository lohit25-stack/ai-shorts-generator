// api/generate.ts
export async function POST(req: Request) {
    const body = await req.json();
    const prompt = body.prompt;
  
    const response = {
      result: `Generated short for: "${prompt}" 🚀`,
    };
  
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }