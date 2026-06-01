# Build the production code for the blog.
FROM node:11-alpine as build

WORKDIR /app

COPY package.json /app/package.json

RUN npm install

COPY . /app

RUN npm run build

# Production: serve the build with a small Express server that injects per-post
# meta tags and a live sitemap for crawlers (server/index.js). This replaces the
# previous static nginx host, which could not render metadata for social
# previews or non-JavaScript search engines.
FROM node:11-alpine

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY --from=build /app/server ./server
COPY --from=build /app/lib ./lib
COPY --from=build /app/package.json ./package.json

ENV PORT=80

# The Node server needs an ABSOLUTE backend origin to fetch posts (a relative/
# empty base works in the browser but throws in Node). Provide it at deploy time,
# e.g. `docker run -e API_URL=https://api.joshhoy.com ...`. Without it, the app
# still serves fine but per-post meta injection and the live sitemap are disabled.
# SITE_URL must match the REACT_APP_SITE_URL baked into the client build so the
# server-injected canonical/og:url agree with the client-rendered ones.
ENV API_URL=""
ENV SITE_URL="https://joshhoy.com"

EXPOSE 80

CMD ["node", "server/index.js"]
