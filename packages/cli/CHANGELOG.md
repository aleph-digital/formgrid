# Changelog

## [1.0.0] - 2025-10-11

### Added
- Initial release of @formgrid/cli
- Supabase-like CLI for managing Formgrid with Docker
- Commands:
  - `formgrid start` - Start all Docker services
  - `formgrid start -d` - Start in detached mode
  - `formgrid stop` - Stop all services
  - `formgrid restart` - Restart all services
  - `formgrid logs` - View logs
  - `formgrid logs -s <service>` - View specific service logs
  - `formgrid ps` - List running containers
  - `formgrid status` - Check service health with color-coded output
  - `formgrid clean` - Remove all containers and volumes
  - `formgrid migrate` - Run database migrations
- Colorful terminal output with chalk
- Loading spinners with ora
- Beautiful status display
- Error handling and user-friendly messages

### Tech Stack
- TypeScript with strict mode
- Commander.js for CLI framework
- Execa for process execution
- Chalk for colored output
- Ora for spinners
- tsup for fast bundling
- ESM + CJS dual output

### Features
- Works from any directory in the monorepo
- Detached mode for background execution
- Service-specific log viewing
- Health status checking
- Clean command for fresh starts
- Migration support


