# Simple Dockerfile for building and serving the Jekyll site
FROM ruby:3.2

# Install dependencies
RUN apt-get update -qq && \
    apt-get install -y build-essential libpq-dev nodejs

# Set working directory
WORKDIR /site

# Copy Gemfiles and install gems
COPY Gemfile Gemfile.lock ./
RUN gem install bundler && bundle install

# Copy the rest of the site
COPY . .

# Expose the default Jekyll port
EXPOSE 4000

# Serve the site
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0"]
