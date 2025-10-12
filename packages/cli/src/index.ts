#!/usr/bin/env node
import { Command } from "commander";
import { execa } from "execa";
import chalk from "chalk";
import ora from "ora";
import { existsSync } from "fs";
import { join } from "path";

const program = new Command();

/**
 * Check if running from FormGrid project root
 */
function isFormGridProject(): boolean {
    return existsSync("docker/docker-compose.yml") &&
        existsSync("pnpm-workspace.yaml") &&
        existsSync("packages/api");
}

/**
 * Ensure running from project root
 */
function ensureProjectRoot(): void {
    if (!isFormGridProject()) {
        console.error(chalk.red("Error: Must run from FormGrid project root directory"));
        console.log(chalk.yellow("\n Navigate to your FormGrid project first:"));
        console.log(chalk.gray("   cd /path/to/formgrid"));
        console.log(chalk.gray("   formgrid start"));
        console.log(chalk.gray("\nOr clone FormGrid:"));
        console.log(chalk.gray("   git clone git@github.com:allenarduino/formgrid.git"));
        console.log(chalk.gray("   cd formgrid"));
        console.log(chalk.gray("   formgrid start"));
        process.exit(1);
    }
}

program
    .name("formgrid")
    .description("CLI for running Formgrid locally (using Docker)")
    .version("1.0.0")
    .hook("preAction", () => {
        ensureProjectRoot();
    });

program
    .command("start")
    .description("Start Formgrid locally using Docker Compose")
    .option("-d, --detached", "Run in detached mode (background)")
    .action(async (options) => {
        const spinner = ora("Starting Formgrid with Docker...").start();
        try {
            const args = ["-f", "docker/docker-compose.yml", "up", "--build"];
            if (options.detached) {
                args.push("-d");
            }

            await execa("docker", ["compose", ...args], {
                stdio: options.detached ? "pipe" : "inherit",
                cwd: process.cwd()
            });

            spinner.succeed(chalk.green("Formgrid started successfully!"));
            console.log(chalk.cyan("\n Access your services:"));
            console.log(chalk.white("  • Dashboard: ") + chalk.blue("http://localhost:5173"));
            console.log(chalk.white("  • API:       ") + chalk.blue("http://localhost:4001"));
            console.log(chalk.white("  • MinIO:     ") + chalk.blue("http://localhost:9001"));

            if (options.detached) {
                console.log(chalk.gray("\n Tip: Use 'formgrid logs' to view logs"));
            }
        } catch (err: any) {
            spinner.fail(chalk.red(" Failed to start Formgrid."));
            console.error(chalk.red(err.message));
            process.exit(1);
        }
    });

program
    .command("stop")
    .description("Stop all Formgrid Docker containers")
    .action(async () => {
        const spinner = ora("Stopping Formgrid containers...").start();
        try {
            await execa("docker", ["compose", "-f", "docker/docker-compose.yml", "down"], {
                stdio: "pipe",
                cwd: process.cwd()
            });
            spinner.succeed(chalk.green("Formgrid stopped successfully."));
        } catch (err: any) {
            spinner.fail(chalk.red("Failed to stop Formgrid."));
            console.error(chalk.red(err.message));
            process.exit(1);
        }
    });

program
    .command("restart")
    .description("Restart all Formgrid Docker containers")
    .action(async () => {
        const spinner = ora("Restarting Formgrid...").start();
        try {
            await execa("docker", ["compose", "-f", "docker/docker-compose.yml", "restart"], {
                stdio: "pipe",
                cwd: process.cwd()
            });
            spinner.succeed(chalk.green("Formgrid restarted successfully."));
        } catch (err: any) {
            spinner.fail(chalk.red("Failed to restart Formgrid."));
            console.error(chalk.red(err.message));
            process.exit(1);
        }
    });

program
    .command("logs")
    .description("View logs for the running Formgrid Docker containers")
    .option("-f, --follow", "Follow log output", true)
    .option("-s, --service <service>", "Show logs for specific service (backend, frontend, db, redis, minio)")
    .action(async (options) => {
        try {
            const args = ["-f", "docker/docker-compose.yml", "logs"];
            if (options.follow) {
                args.push("-f");
            }
            if (options.service) {
                args.push(options.service);
            }

            await execa("docker", ["compose", ...args], {
                stdio: "inherit",
                cwd: process.cwd()
            });
        } catch (err: any) {
            console.error(chalk.red("Failed to view logs."));
            console.error(chalk.red(err.message));
            process.exit(1);
        }
    });

program
    .command("ps")
    .description("List all running Formgrid containers")
    .action(async () => {
        try {
            await execa("docker", ["compose", "-f", "docker/docker-compose.yml", "ps"], {
                stdio: "inherit",
                cwd: process.cwd()
            });
        } catch (err: any) {
            console.error(chalk.red("Failed to list containers."));
            console.error(chalk.red(err.message));
            process.exit(1);
        }
    });

program
    .command("clean")
    .description("Stop containers and remove volumes (clean slate)")
    .action(async () => {
        const spinner = ora("Cleaning up Formgrid...").start();
        try {
            await execa("docker", ["compose", "-f", "docker/docker-compose.yml", "down", "-v"], {
                stdio: "pipe",
                cwd: process.cwd()
            });
            await execa("docker", ["system", "prune", "-f"], {
                stdio: "pipe",
                cwd: process.cwd()
            });
            spinner.succeed(chalk.green("Formgrid cleaned successfully."));
            console.log(chalk.gray("All containers, volumes, and unused images removed."));
        } catch (err: any) {
            spinner.fail(chalk.red("Failed to clean Formgrid."));
            console.error(chalk.red(err.message));
            process.exit(1);
        }
    });

program
    .command("status")
    .description("Check the status of Formgrid services")
    .action(async () => {
        console.log(chalk.cyan("Formgrid Status:\n"));
        try {
            const { stdout } = await execa("docker", ["compose", "-f", "docker/docker-compose.yml", "ps", "--format", "json"], {
                cwd: process.cwd()
            });

            if (!stdout) {
                console.log(chalk.yellow("No containers running."));
                console.log(chalk.gray("Run 'formgrid start' to start Formgrid."));
                return;
            }

            const containers = stdout.split('\n').filter(Boolean).map(line => JSON.parse(line));

            containers.forEach((container: any) => {
                const status = container.State === 'running' ? chalk.green('● Running') : chalk.red('○ Stopped');
                console.log(`${status} ${chalk.white(container.Service.padEnd(20))} ${chalk.gray(container.Status)}`);
            });
        } catch (err: any) {
            console.error(chalk.red("Failed to check status."));
            console.error(chalk.red(err.message));
            process.exit(1);
        }
    });

program
    .command("migrate")
    .description("Run database migrations")
    .action(async () => {
        const spinner = ora("Running database migrations...").start();
        try {
            await execa("docker", [
                "compose", "-f", "docker/docker-compose.yml",
                "exec", "backend", "npx", "prisma", "migrate", "dev"
            ], {
                stdio: "inherit",
                cwd: process.cwd()
            });
            spinner.succeed(chalk.green("Migrations completed successfully."));
        } catch (err: any) {
            spinner.fail(chalk.red("Failed to run migrations."));
            console.error(chalk.red(err.message));
            process.exit(1);
        }
    });

program.parse();

