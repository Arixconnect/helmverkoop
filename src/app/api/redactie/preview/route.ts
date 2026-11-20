import { timingSafeEqual, createHash } from "node:crypto";
import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

const digest = (value: string) => createHash("sha256").update(value).digest();
const headers = {"Cache-Control":"private, no-store","X-Robots-Tag":"noindex, nofollow"};

export async function POST(request: Request) {
  const secret = process.env.SANITY_PREVIEW_SECRET;
  if (!secret || !process.env.SANITY_READ_TOKEN || process.env.CMS_MODE !== "SANITY") {
    return new Response("Redactiepreview is niet geconfigureerd.", {status:404,headers});
  }
  const data = await request.formData().catch(()=>null);
  const provided = data?.get("secret");
  if (typeof provided !== "string" || !timingSafeEqual(digest(secret),digest(provided))) {
    return new Response("Ongeldige toegang.", {status:403,headers});
  }
  const path = data?.get("path") ?? "/";
  if (typeof path !== "string" || !/^\/(?:kenniscentrum(?:\/[a-z0-9-]+)?|helmplicht-fatbike|veelgestelde-vragen)?$/.test(path)) {
    return new Response("Ongeldig voorbeeldpad.", {status:400,headers});
  }
  const draft = await draftMode();
  if (data?.get("action") === "close") draft.disable();
  else draft.enable();
  return NextResponse.redirect(new URL(path, request.url), {status:303,headers});
}
