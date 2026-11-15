# DEPLOY · GitHub Pages

1. Репозиторий: https://github.com/Grobovchik797/self-development-platform .
2. На GitHub: **Settings → Pages → Build and deployment → Source → GitHub Actions** (одноразовая настройка владельца; нужна, если Pages ещё не активированы).
3. После изменения ветки `main` workflow `.github/workflows/pages.yml` проверяет HTML/JS и публикует статический артефакт.
4. Успешный deploy должен вывести адрес вида https://grobovchik797.github.io/self-development-platform/ .
5. До успешной загрузки страницы по HTTPS это только предполагаемый адрес, не подтверждённая публикация.
6. Если Pages отключены, job `Configure Pages` может завершиться ошибкой. Выбрать GitHub Actions как Source и запустить workflow повторно.

**Приватность:** сайт и код доступны всем, кто знает адрес; тэг `noindex` не даёт контроль доступа. Никаких исходных защищённых книг, аудио и личных заметок в репозитории.
