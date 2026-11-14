import { SectionCards } from "@/components/SectionCards/SectionCards";
import { SectionHero } from "@/components/SectionHero/SectionHero";
import { createClient } from "@/prismicio";


export default async function Home() {

    const client = createClient();

    const page = await client.getSingle("home");

  return (
    <>
      <SectionHero
      title={page.data.title_hero}
      span={page.data.subtitle_hero}
      btnText={page.data.button_text}
      linkWaiting={page.data.link_lista_espera}
      />
      <SectionCards />
    </>
  )
}
