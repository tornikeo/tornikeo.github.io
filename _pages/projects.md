---
layout: page
title: Engineering projects
permalink: /projects/
prose: false
display_categories: [large projects, projects, personal]
---

<div class="space-y-8">
  {% if site.enable_project_categories and page.display_categories %}
    {% for category in page.display_categories %}
      {% assign items = site.projects | where: "category", category | sort: "importance" %}
      {% if items.size > 0 %}
        <section class="space-y-4">
          <h2 class="text-xl font-semibold tracking-tight">{{ category | capitalize }}</h2>
          {% include project-grid.html projects=items %}
        </section>
      {% endif %}
    {% endfor %}
  {% else %}
    {% assign items = site.projects | sort: "importance" %}
    {% include project-grid.html projects=items %}
  {% endif %}
</div>
