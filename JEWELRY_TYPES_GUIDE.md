# Jewelry VTO Types Guide

VIATRYON now supports three types of jewelry virtual try-on using Perfect Corp API:

## 🎯 Supported Types

### 1. **Watch**
- **API Endpoint**: `/s2s/v2.0/task/2d-vto/watch`
- **Image Requirements**: Wrist visible, hand relaxed
- **Parameters**:
  - `watch_wearing_location`: 0.3 (default position)
  - `watch_shadow_intensity`: 0.15
  - `watch_ambient_light_intensity`: 1
  - `watch_need_remove_background`: false

### 2. **Bracelet**
- **API Endpoint**: `/s2s/v2.0/task/2d-vto/bracelet`
- **Image Requirements**: Wrist visible, hand relaxed
- **Parameters**:
  - `bracelet_wearing_location`: 0.3 (default position)
  - `bracelet_shadow_intensity`: 0.15
  - `bracelet_ambient_light_intensity`: 1
  - `bracelet_need_remove_background`: false

### 3. **Ring**
- **API Endpoint**: `/s2s/v2.0/task/2d-vto/ring`
- **Image Requirements**: Hand visible with fingers spread
- **Parameters**:
  - `ring_wearing_location`: 0.3 (default position)
  - `ring_shadow_intensity`: 0.15
  - `ring_ambient_light_intensity`: 1
  - `ring_need_remove_background`: false

## 📝 How It Works

1. **Product Creation**: When creating a product, set the `type` field to one of: `watch`, `bracelet`, or `ring`
2. **API Routing**: The VTO API route automatically detects the product type and uses the correct Perfect Corp endpoint
3. **User Experience**: The camera instructions adapt based on product type (wrist vs. hand capture)

## 🧪 Testing

To test each jewelry type:

1. **Create Products** with different types in the dashboard
2. **Upload Images** for each product type
3. **Generate QR Codes** for mobile testing
4. **Capture Photos** following the type-specific instructions
5. **Verify Results** from Perfect Corp API

## 💰 API Costs

- Each VTO request costs **1 API unit**, regardless of jewelry type
- Units are deducted only after successful VTO completion
- Failed attempts do NOT deduct units

## 🔧 Database Schema

Products table supports all three types:
```sql
type text not null check (type in ('watch', 'ring', 'bracelet'))
```

## 📚 Perfect Corp Documentation

For advanced parameters and customization:
- Watch VTO: https://developer.perfectcorp.com/docs/watch-vto
- Bracelet VTO: https://developer.perfectcorp.com/docs/bracelet-vto
- Ring VTO: https://developer.perfectcorp.com/docs/ring-vto
