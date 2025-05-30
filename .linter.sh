#!/bin/bash
cd /home/kavia/workspace/code-generation/skillbridge-15023-1c71ecf3/skillgap_analyzer_web_app
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

