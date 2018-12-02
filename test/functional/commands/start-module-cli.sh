#!/usr/bin/env bash

npm run relay start -- --path=${domapic_path} ${service_extra_options}
npm run relay logs
