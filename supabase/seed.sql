insert into public.products
  (handle, title, collection, subtitle, description, price_cents, images, size_chart_image, preorder, ships_note, fit_note, sort_order)
values (
  'kw2d-meisai-collection-hoodie',
  'Meisai Collection Hoodie',
  'Meisai Collection',
  'Reversible · Snow Camo & Waffle Knit',
  'Reversible zip hoodie in snow camo with a waffle knit reverse. Raw-edge hood with Meisai branding.',
  11000,
  array['Drop1IMG1.jpeg','Drop1IMG2.jpeg','Drop1IMG3.jpeg','Drop1IMG4.jpeg'],
  'Drop1IMG5.jpeg',
  true,
  'Ships in 4–6 weeks',
  'Model is 6''4 wearing size XL',
  0
) on conflict (handle) do nothing;

insert into public.product_variants (product_id, size, sort_order)
select p.id, s.size, s.ord
from public.products p,
  (values ('S',1),('M',2),('L',3),('XL',4),('XXL',5)) as s(size, ord)
where p.handle = 'kw2d-meisai-collection-hoodie'
on conflict (product_id, size) do nothing;
