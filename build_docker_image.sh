#! /usr/bin/env bash
quasar build
docker build -t aadlinux358/zaer-hr-frontend:latest .
