# Redis Metrics Exporter

Simple webserver exporting Redis data as Prometheus metrics.

# Installation

Make sure you have Redis and Node installed beforehand.

```
git clone https://github.com/nwmqpa/redis-metrics-exporter
cd redis-metrics-exporter
npm install
```

# Configuration

You have to configure two things, the env file, which is of the sort

`PORT` is optional and defaults to 4000

```
REDIS_HOST=127.0.0.1:6379
PORT=4000
```

And the second thing to configure is the `config.json` at the root.

```json
{
  "metrics": [
    {
      "name": "my_metric", // Metric name as defined in prometheus
      "description": "This is my exported metric", // Metric description as defined in prometheus
      "type": "counter", // Metric Type as defined in prometheus,
      "matching": "my_data:{endpoint}" // Redis Keys to search
    }
  ]
}
```

For the `matching` key, every capture group of the sort `{capture_group_name}` will end up being a tag on prometheus, and a `*` on the redis `keys` search, ex:

```
keys my_data:*
```
