# Docker Deployment Guide

This guide explains how to build and deploy the documentation website using Docker with a secure, lightweight container.

## Quick Start

```bash
# Build the image
docker build -t docs-website:latest .

# Run the container
docker run -d -p 3000:3000 --name docs docs-website:latest
```

### Using Docker Compose

```bash
# Build and run with compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## Security Features

- ✅ **Non-root user**: Runs as `nextjs` user (UID 1001)
- ✅ **Multi-stage build**: Minimal final image size (~200MB)
- ✅ **Alpine Linux**: Lightweight base image
- ✅ **Minimal dependencies**: Only production dependencies
- ✅ **No telemetry**: Next.js telemetry disabled

## Image Size

- **Final image**: ~200MB (Next.js standalone)

## Environment Variables

You can set these environment variables:

```bash
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_TELEMETRY_DISABLED=1 \
  docs-website:latest
```

## Production Deployment

### 1. Build for production

```bash
docker build -t docs-website:latest .
```

### 2. Tag for registry

```bash
docker tag docs-website:latest your-registry/docs-website:latest
```

### 3. Push to registry

```bash
docker push your-registry/docs-website:latest
```

### 4. Deploy

```bash
docker pull your-registry/docs-website:latest
docker run -d -p 3000:3000 --name docs --restart unless-stopped docs-website:latest
```

## Health Checks

The container includes health checks:

```bash
# Check health
docker ps  # Shows health status

# Manual health check
curl http://localhost:3000/
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker logs docs

# Run interactively
docker run -it docs-website:latest sh
```

### Port conflicts

```bash
# Use different port
docker run -d -p 9090:3000 docs-website:latest
```

### Permission issues

The container runs as non-root user. If you need to debug:

```bash
# Run as root (not recommended for production)
docker run -it --user root docs-website:latest sh
```

## Performance Optimization

### Next.js Configuration

- Standalone output (minimal dependencies)
- Production optimizations enabled
- Telemetry disabled

## Security Best Practices

1. **Keep images updated**: Regularly rebuild with latest base images
2. **Use secrets management**: Don't hardcode secrets in Dockerfiles
3. **Scan images**: Use tools like `docker scan` or Trivy
4. **Limit resources**: Use Docker resource limits

```bash
docker run -d \
  --memory="512m" \
  --cpus="1.0" \
  -p 3000:3000 \
  docs-website:latest
```

## Monitoring

### View logs

```bash
# Docker logs
docker logs -f docs

# Docker Compose logs
docker-compose logs -f web
```

### Resource usage

```bash
docker stats docs
```

## Updating

```bash
# Pull latest
docker pull docs-website:latest

# Stop old container
docker stop docs
docker rm docs

# Start new container
docker run -d -p 3000:3000 --name docs docs-website:latest
```

## Support

For issues or questions, check:
- Next.js documentation: https://nextjs.org/docs
- Docker documentation: https://docs.docker.com
