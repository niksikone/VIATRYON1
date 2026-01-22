#!/bin/bash
# Minimal curl test for Perfect Corp Watch VTO API
# Tests API key entitlement only

curl -X POST "https://yce-api-01.makeupar.com/s2s/v2.0/task/2d-vto/watch" \
  -H "Authorization: Bearer sk-YIVc0V6790GGm4QYQrcwe8Zd0xrcefMsR4shlTSJcA0QLIwXZbcLQYN0_q_BT3Mf" \
  -H "Content-Type: application/json" \
  -d '{
    "src_file_url": "https://plugins-media.makeupar.com/strapi/assets/watch_and_bracelet_user_01_09f16603cb.png",
    "source_info": {"name": "https://plugins-media.makeupar.com/strapi/assets/watch_and_bracelet_user_01_09f16603cb.png"},
    "ref_file_urls": ["https://plugins-media.makeupar.com/strapi/assets/watch_product_01_aab8053028.png"],
    "ref_file_ids": [],
    "refmsk_file_urls": [],
    "refmsk_file_ids": [],
    "object_infos": [{
      "name": "https://plugins-media.makeupar.com/strapi/assets/watch_product_01_aab8053028.png",
      "parameter": {
        "watch_need_remove_background": false,
        "watch_wearing_location": 0,
        "watch_shadow_intensity": 0.15,
        "watch_ambient_light_intensity": 1
      }
    }]
  }'
