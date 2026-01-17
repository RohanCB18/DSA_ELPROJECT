
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request) {
    try {
        const body = await request.json();
        const { stations } = body;

        if (!stations || stations.length !== 6) {
            return new Response('Invalid input', { status: 400 });
        }

        const inputArgs = stations.map(s => `${s.waiting} ${s.drop}`).join(' ');

        const backendPath = path.resolve(process.cwd(), '../backend/backend_sim.exe');
        
        // Convert Windows path to WSL path format
        const wslPath = backendPath.replace(/\\/g, '/').replace(/^([A-Za-z]):/, (_, drive) => `/mnt/${drive.toLowerCase()}`);

        console.log(`Spawning backend via WSL: ${wslPath} with input: ${inputArgs}`);

        const child = spawn('wsl', ['-d', 'Ubuntu', '--', wslPath]);

        child.stdin.write(inputArgs + '\n');
        child.stdin.end();

        const stream = new ReadableStream({
            start(controller) {
                child.stdout.on('data', (data) => {
                    controller.enqueue(data);
                });

                child.stderr.on('data', (data) => {
                    console.error(`Backend Error: ${data}`);
                });

                child.on('close', (code) => {
                    console.log(`Backend exited with code ${code}`);
                    controller.close();
                });

                child.on('error', (err) => {
                    console.error('Failed to start subprocess.', err);
                    controller.error(err);
                });
            },
            cancel() {
                child.kill();
            },
        });

        return new Response(stream, {
            headers: { 'Content-Type': 'text/plain' },
        });

    } catch (error) {
        console.error('API Error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
