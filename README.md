# Cognex Key Generator

A Next.js TypeScript application with shadcn/ui for generating Cognex offline program keys.

## Getting Started

First, install the dependencies with Bun:

```bash
bun install
```

Then, run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- Enter an 8-character hexadecimal program reference
- Automatically generates the offline program key
- Copy button to easily copy the generated key
- Clean, modern UI with shadcn/ui components
- Responsive design

## Formula

The key generation uses the formula: `y = 0xFA266148 - x (mod 2³²)`

where `x` is the program reference and `y` is the generated key.

## Docker (production)

Build the production image and run it locally:

```bash
# build image
docker build -t cognex-key-generator:latest .

# run container
docker run --rm -p 3000:3000 cognex-key-generator:latest
```

Or use docker-compose:

```bash
docker-compose up --build
```
