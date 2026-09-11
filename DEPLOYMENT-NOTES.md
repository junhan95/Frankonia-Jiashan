# Development preview and production migration

## Environments

- GitHub Pages at https://junhan95.github.io/Frankonia-Jiashan/ is a temporary development and review environment. Keep its base path and noindex configuration until migration.
- The production destination is https://www.emc-frankonia.com at the domain root, operated by the Jiashan company under Chinese law.
- The legal pages describe the intended production service. They are not a declaration that the existing production website has already been replaced.

## Preview hosting privacy

GitHub Pages logs visitors' IP addresses for security purposes. This applies to the temporary preview independently of the intended production hosting. See [GitHub Pages data collection](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection) and [GitHub Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement).

## Production checks

The existing site displays Alibaba Cloud / Wanwang service attribution and ICP number 浙ICP备14033841号. This does not establish the replacement site's precise hosting contract, log configuration or storage region. Confirm those deployment details and update the production privacy notice before launch.

The replacement currently uses mailto enquiry flows and local browser storage. The old site has web submission forms. If server-side submission is retained or introduced during migration, update the notice and test the actual recipients, storage and consent flow.

Confirm the existing ICP domain/access-provider records, production logs and retention, overseas enquiry recipient and required transfer procedures. The supplied privacy policy date does not mean the replacement site was deployed on that date.

For the production build use STATIC_EXPORT=1, an empty NEXT_PUBLIC_BASE_PATH and NEXT_PUBLIC_SITE_ORIGIN=https://www.emc-frankonia.com. Enable NEXT_PUBLIC_INDEXABLE only when ready to launch. Run the ordinary Next build with these environment variables; npm run build:static intentionally overrides them for the GitHub Pages preview.

Before switching DNS or uploading, verify root and English routes, static assets, HTTPS, sitemap/canonical URLs and redirects from legacy URLs such as /home and /lxwm. No production migration or DNS change has been performed by these content edits.
