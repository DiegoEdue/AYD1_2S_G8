import { redirect } from "next/navigation";
import { PREVIEW_ROL, RUTA_POR_ROL } from "@/lib/preview-config";

export default function Home() {
  //redirect("/login");
  redirect(RUTA_POR_ROL[PREVIEW_ROL]);
}
