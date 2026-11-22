---
layout: page
permalink: /publications/
title: Research
prose: false
years: [2025, 2020, 2019]
---

<div class="space-y-8">
  {% for year in page.years %}
    <section class="space-y-4 [&_.bibliography]:space-y-4">
      <h2 class="text-xl font-semibold tracking-tight">{{ year }}</h2>
      {% bibliography -f papers -q @*[year={{year}}]* %}
    </section>
  {% endfor %}
</div>
