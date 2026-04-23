import { NextResponse } from "next/server";
import { encodeAnswers, generateTitle, type Answers } from "@/lib/diagnosis";

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<Answers>;
  if (
    !body.energy ||
    !body.workstyle ||
    !body.social ||
    !body.fuel ||
    !body.vibe
  ) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const answers: Answers = {
    energy: body.energy,
    workstyle: body.workstyle,
    social: body.social,
    fuel: body.fuel,
    vibe: body.vibe
  };

  const id = encodeAnswers(answers);
  const title = generateTitle(answers);

  return NextResponse.json({ id, title });
}
