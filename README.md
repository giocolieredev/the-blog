# crii.me blog — blog.crii.me

The standalone blog for [crii.me](https://crii.me), built with Jekyll and hosted
for free on GitHub Pages at **https://blog.crii.me**.

Same brutalist look and feel as the main site: orange/black theme, Space Grotesk
+ Space Mono, scanlines, cookie banner, RSS feed, and the same newsletter form
(StaticForms).

## Repos

Both sites are published from the **giocolieredev** GitHub account.

| Site         | Repo                      | URL                  |
| ------------ | ------------------------- | -------------------- |
| Main website | published from `giocolieredev` | https://crii.me  |
| Blog         | `giocolieredev/the-blog`  | https://blog.crii.me |

`crii.me/blog/` on the main site redirects here.

## Local development

Requires Ruby + Jekyll (see [jekyllrb.com](https://jekyllrb.com/docs/)):

```bash
bundle install
bundle exec jekyll serve
```

Then open http://localhost:4000.

## Writing a post

Add a file to `_posts/` named `YYYY-MM-DD-your-title.md` with front matter:

```markdown
---
layout: post
title: "Your post title"
description: "One line summary."
date: 2026-08-20 12:00:00 +0000
tags: [dev, meta]
---

Content here. Use `<!--more-->` to cut the excerpt shown on the index.
```

## Publishing to GitHub

Create/push the repo from the `giocolieredev` account:

```bash
gh repo create the-blog --public --source . --push
```

(or `git remote add origin git@github.com:giocolieredev/the-blog.git && git push -u origin main`)

Push to `main` and GitHub Pages rebuilds automatically (takes ~1 minute).

## DNS & custom domain

`blog.crii.me` is a subdomain of `crii.me` (already verified on GitHub Pages),
so it just needs one DNS record at your registrar/DNS provider (Namecheap):

```
Type:  CNAME
Name:  blog
Value: giocolieredev.github.io
```

(The CNAME target must be `<username>.github.io` of the account that hosts the
Pages site — here that's `giocolieredev`.)

(Or four A records pointing to `185.199.108.153`, `185.199.109.153`,
`185.199.110.153`, `185.199.111.153`.)

The `CNAME` file in this repo already declares `blog.crii.me`, and the Pages
custom domain is set in the repo settings.

## Notes

- Permalink style is `/blog/:title/` so old `crii.me/blog/<slug>` links keep
  working here (e.g. `crii.me/blog/hello-world` → `blog.crii.me/blog/hello-world`).
- RSS feed is at `/feed.xml`, sitemap at `/sitemap.xml`.
