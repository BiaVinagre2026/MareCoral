# Coral Real v2 — rosto refinado com referências da Bia

Data: 11/08/2026  
Status: candidata à aprovação

## Objetivo

Refinar apenas a identidade facial da Coral Real com fotos autorizadas da Bia, mantendo o corpo aprovado, o conjunto rosa, as poses, os formatos e o cenário da versão v1.

As fotos pessoais usadas como referência permanecem fora do repositório público. Nenhuma delas foi copiada para `public/`.

## Entregáveis

- `look-rosa-coral-real-1x1-v2.png`
- `look-rosa-coral-real-4x5-v2.png`
- `look-rosa-coral-real-9x16-v2.png`
- `../coral-real-identidade-v2.png`

O resultado bruto do mestre 4:5 foi preservado como `look-rosa-coral-real-4x5-v2-source.png`. A entrega `look-rosa-coral-real-4x5-v2.png` foi normalizada localmente para `1200 × 1500`, com extensão discreta do fundo e sem recortar corpo ou roupa.

## Prompt mestre 4:5

```text
Use case: identity-preserve
Asset type: refined 4:5 master try-on image for Coral Real v2
Input images: Image 1 is the edit target and controls the body, pose, outfit, hands, footwear, framing, lighting and studio background. Images 2–5 are authorized face references of the same real adult woman, Bia, photographed at different angles and in different lighting. Use the consensus identity from Images 2–5; ignore their clothing, backgrounds, accessories, camera distortion and lighting.
Primary request: change only the face, head identity, natural age cues, hairline and face-framing hair in Image 1 so Coral Real clearly resembles Bia from Images 2–5.
Facial identity to preserve from the references: Bia’s natural adult facial proportions; oval-to-long face shape; broad forehead and natural hairline; dark brown almond-shaped eyes; characteristic eyebrows; straight natural nose; wide warm smile; real tooth shape; cheek structure and smile lines; medium warm tan skin; authentic skin texture. Keep her recognizable natural age and expression without artificially making her younger.
Hair: long dark-brown hair with restrained warm brown highlights, natural density and a polished soft movement appropriate for the studio; keep the overall length and placement compatible with Image 1.
Expression: Bia’s warm, confident natural smile, friendly and sporty.
Invariants: keep Image 1’s body shape and proportions exactly unchanged; keep the head scale anatomically proportional to that body. Keep the asymmetric raspberry-pink crop top, full-length textured leggings, waistband, seams, small plain dark tag, sneakers, pose, hands, studio, shadows, 4:5 composition and all garment details unchanged.
Style/medium: photorealistic editorial fashion photography with real pores, natural expression lines, believable eyes and teeth; polished lighting but no beauty-filter plastic skin.
Avoid: changing the body, waist, hips, muscles, outfit, texture, tag, pose, hands, shoes, background or crop; no face from the previous synthetic v1; no exaggerated eyes; no doll-like face; no de-aging; no heavy makeup; no altered ethnicity; no jewelry; no text; no watermark; no extra logos.
```

## Prompt 1:1

```text
Use case: identity-preserve
Asset type: refined square 1:1 try-on image for Coral Real v2
Input images: Image 1 is the edit target and controls the square composition, body, pose, outfit, hands, shoes, lighting and background. Image 2 is the approved Coral Real v2 face and hair anchor. Images 3–5 are authorized real face references of Bia used only to reinforce her recognizable identity and natural adult features.
Primary request: change only Image 1’s face, head identity, natural age cues, hairline and face-framing hair to exactly match Coral Real v2 in Image 2 and the consensus identity of Bia in Images 3–5.
Face: preserve Bia’s oval-to-long face, broad forehead, dark brown almond-shaped eyes, characteristic eyebrows, natural nose, wide warm smile, authentic tooth shape, cheeks, smile lines, medium warm tan skin and natural adult age. Use realistic pores and expression lines; no de-aging.
Invariants: keep Image 1’s body and proportions, full-body square framing, pose, hands, shoes, asymmetric pink top, textured high-waisted leggings, seams, waistband, dark tag, warm-sand studio, shadows and every garment detail unchanged.
Avoid: any body or outfit change; identity drift; synthetic v1 face; exaggerated eyes; doll face; beauty-filter skin; heavy makeup; altered ethnicity; jewelry; props; text; watermark; extra logos.
```

## Prompt 9:16

```text
Use case: identity-preserve
Asset type: refined vertical 9:16 video keyframe for Coral Real v2
Input images: Image 1 is the edit target and controls the 9:16 composition, walking pose, body, outfit, hands, shoes, lighting and background. Image 2 is the approved Coral Real v2 face and hair anchor. Images 3–5 are authorized real face references of Bia used only to reinforce her recognizable identity and natural adult features.
Primary request: change only Image 1’s face, head identity, natural age cues, hairline and face-framing hair to exactly match Coral Real v2 in Image 2 and the consensus identity of Bia in Images 3–5.
Face: preserve Bia’s oval-to-long face, broad forehead, dark brown almond-shaped eyes, characteristic eyebrows, natural nose, wide warm smile, authentic tooth shape, cheeks, smile lines, medium warm tan skin and natural adult age. Use realistic pores and expression lines; no de-aging.
Invariants: keep Image 1’s body and proportions, walking pose, full 9:16 framing, hands, shoes, asymmetric pink top, textured high-waisted leggings, seams, waistband, dark tag, safe space, warm-sand studio, shadows and every garment detail unchanged.
Avoid: any body or outfit change; identity drift; synthetic v1 face; exaggerated eyes; doll face; beauty-filter skin; heavy makeup; altered ethnicity; jewelry; props; text; watermark; extra logos.
```

## Prompt da prancha-mestra v2

```text
Use case: identity-preserve
Asset type: master identity reference sheet for Coral Real v2
Input images: Image 1 is the approved Coral Real v2 body, proportions, polished studio styling, hair treatment and current facial anchor. Images 2–5 are authorized real face references of Bia and define the definitive facial identity, natural adult age, skin texture and smile.
Primary request: create a clean four-panel photorealistic identity sheet of the exact same Coral Real v2 in every panel, recognizably based on Bia.
Facial identity: preserve Bia’s oval-to-long face, broad forehead and natural hairline, dark brown almond-shaped eyes, characteristic eyebrows, natural nose, wide warm smile, authentic teeth, cheek structure, smile lines, medium warm tan skin and natural adult age. No de-aging and no synthetic doll features.
Body: preserve the natural athletic body shape and proportions from Image 1 exactly, including shoulder width, waist, hips, arms and legs.
Hair: long dark-brown hair with restrained warm highlights, realistic density and soft polished movement.
Wardrobe: simple unbranded coral-and-rose athletic set, high-waisted leggings and supportive top, consistent in all full-body views.
Scene/backdrop: seamless warm off-white studio background, evenly lit and uncluttered.
Composition/framing: four balanced panels showing the same identity: frontal head-and-shoulders portrait with gentle smile; three-quarter head-and-shoulders portrait with neutral-friendly expression; full-body neutral front pose; full-body relaxed three-quarter pose. Full head and feet visible in body panels.
Style/medium: photorealistic fashion casting photography with real pores, subtle expression lines, natural hair strands and realistic performance fabric.
Constraints: identical identity, natural age and body proportions across all panels; realistic anatomy and hands; no face drift, no exaggerated eyes, no caricature, no doll proportions, no youth filter, no heavy makeup, no jewelry, no props, no text, no labels, no watermark, no extra logos.
```

Todas as imagens foram produzidas com a ferramenta integrada de geração de imagens.
