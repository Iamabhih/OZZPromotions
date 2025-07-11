# OZZPromotions
July 2025 Promotional Product Catalog


# 🎉 OZZ Cash & Carry - July 2025 Promotional Catalog

A professional, responsive web catalog featuring dynamic Google Drive image integration, real-time product search, and seamless customer experience for OZZ Cash & Carry's promotional offerings.

## 📋 Table of Contents
- [Features](#-features)
- [Live Demo](#-live-demo)
- [Quick Start](#-quick-start)
- [Google Drive Setup](#-google-drive-setup)
- [File Structure](#-file-structure)
- [Configuration](#-configuration)
- [Deployment](#-deployment)
- [Customization](#-customization)
- [Troubleshooting](#-troubleshooting)
- [Contact & Support](#-contact--support)

## ✨ Features

### 🎯 **Customer Experience**
- **Seamless Loading**: No loading screens - catalog appears instantly
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Advanced Search**: Search by product name, SKU, or category
- **Smart Filtering**: Filter by product categories with one click
- **Interactive Images**: Hover controls, zoom, and fullscreen view
- **Professional Presentation**: Clean, modern interface with smooth animations

### 🔧 **Technical Features**
- **Dynamic Google Drive Integration**: Automatically scans and maps product images
- **Intelligent Caching**: 24-hour image cache for fast loading
- **Real-time Image Mapping**: Automatically matches SKUs to image filenames
- **Pagination System**: 20 products per page for optimal performance
- **Excel Data Integration**: Loads product data from JULY PROMO.xlsx
- **Progressive Web App**: Can be installed on mobile devices

### 📸 **Image Management**
- **Automatic Image Discovery**: Scans Google Drive folder for product images
- **Smart SKU Matching**: Extracts product codes from image filenames
- **Multiple Image Formats**: Supports JPG, PNG, GIF, WebP
- **Fallback System**: Graceful handling of missing images
- **Google CDN Delivery**: Fast image loading via Google's infrastructure

## 🌐 Live Demo

Visit the live catalog: [Your GitHub Pages URL]

**Test Features:**
- Search for products like "bowl", "mug", or specific SKUs
- Try category filtering
- View product details in modal
- Test image zoom and fullscreen features

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/ozz-promotions-catalog.git
cd ozz-promotions-catalog
```

### 2. Required Files
Ensure you have these files in your repository:
- `index.html` - Main catalog file
- `JULY PROMO.xlsx` - Product data spreadsheet
- `manifest.json` - PWA configuration
- `README.md` - This documentation

### 3. GitHub Pages Setup
1. Go to repository **Settings** → **Pages**
2. Set **Source** to "Deploy from a branch"
3. Select **main branch** / (root)
4. Click **Save**
5. Your catalog will be live at: `https://yourusername.github.io/repository-name`

## 📸 Google Drive Setup

### Step 1: Create Google Drive API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **Google Drive API**
4. Create **API Key** (Public API access)
5. Restrict API key to Google Drive API only

### Step 2: Prepare Your Google Drive Folder
1. Create folder structure: `Ikhaya/OzzSA` in your Google Drive
2. Upload product images to this folder
3. **Set folder permissions**: Right-click → Share → "Anyone with the link can view"
4. **Set image permissions**: Select all images → Share → "Anyone with the link can view"

### Step 3: Image Naming Convention
Name your images to include product SKUs:
```
✅ Good Examples:
- 455641.jpg
- SKU-455642.png
- product_136_image.jpg
- 31754-bowl.png

❌ Bad Examples:
- random_image.jpg
- photo1.png
- IMG_001.jpg
```

### Step 4: Update Configuration
In `index.html`, update these values:
```javascript
// Your Google Drive folder ID (get from folder URL)
this.folderId = '1tG66zQTXGR-BQwjYZheRHVQ7s4n6-Jan';

// Your Google Drive API key
this.apiKey = 'YOUR_API_KEY_HERE';
```

## 📁 File Structure

```
ozz-promotions-catalog/
├── index.html              # Main catalog application
├── JULY PROMO.xlsx         # Product data (SKU, Description, Price)
├── manifest.json           # PWA configuration
├── README.md              # Documentation
├── icon-192.png           # PWA icon (192x192)
├── icon-512.png           # PWA icon (512x512)
└── .gitignore             # Git ignore file
```

### Excel File Format (JULY PROMO.xlsx)
Required columns in **Sheet1**:
| Column | Description | Example |
|--------|-------------|---------|
| SKU | Product code | 455641 |
| PAGE 1 | Product description | MUG COFFEE PICCO 6'S C/NOVA |
| PRICE | Promotional price | 89.99 |

## ⚙️ Configuration

### Product Categories
Categories are auto-generated based on keywords in product descriptions:
- **BOWLS**: Products containing "bowl"
- **CUPS & MUGS**: Products containing "cup" or "mug"
- **GLASSWARE**: Products containing "glass", "tumbler", "wine"
- **PLATES**: Products containing "plate", "dinner"
- **STORAGE**: Products containing "storage", "container"
- *Add more in `categorizeProduct()` function*

### Pagination Settings
```javascript
const CONFIG = {
    PRODUCTS_PER_PAGE: 20  // Adjust products per page
};
```

### Cache Settings
```javascript
this.cacheExpiryHours = 24;  // Image cache duration
```

## 🚀 Deployment

### GitHub Pages (Recommended)
1. Push all files to GitHub repository
2. Enable GitHub Pages in repository settings
3. Your catalog will be live automatically
4. Updates deploy automatically on push

### Custom Domain Setup
1. Add `CNAME` file with your domain
2. Update DNS settings:
   ```
   Type: CNAME
   Name: www
   Value: yourusername.github.io
   ```

### Alternative Hosting
The catalog works on any web server that supports:
- Static HTML files
- HTTPS (required for Google Drive API)

## 🎨 Customization

### Branding
Update these elements in `index.html`:
```html
<!-- Logo -->
<img src="YOUR_LOGO_URL" alt="Your Company">

<!-- Company name -->
<span>Your Company Promotions and Special Offers</span>

<!-- Contact information -->
<h5>🏪 YOUR STORE NAME</h5>
<p>Your Address<br>City, Province Postal Code</p>
```

### Colors & Styling
Main color scheme uses Tailwind CSS classes:
- **Primary**: `bg-red-600` (Red)
- **Secondary**: `bg-blue-600` (Blue)
- **Accent**: `bg-yellow-400` (Yellow)
- **Success**: `bg-green-600` (Green)

### Adding New Features
The modular design allows easy additions:
- **Quote system**: Modify `addToQuote()` function
- **Inventory tracking**: Add SOH column to Excel
- **Multi-language**: Add translation functions

## 🔧 Troubleshooting

### Images Not Loading
1. **Check Google Drive permissions**: Ensure "Anyone with the link can view"
2. **Verify API key**: Test in Google Cloud Console
3. **Check folder ID**: Get from Google Drive folder URL
4. **Console errors**: Open F12 → Console for error messages

### Products Not Showing
1. **Excel file location**: Must be named `JULY PROMO.xlsx` in root
2. **Column names**: Check exact spelling: SKU, PAGE 1, PRICE
3. **Data format**: Ensure SKU and PRICE columns have valid data

### Performance Issues
1. **Image optimization**: Use compressed images (< 500KB each)
2. **Limit images**: Recommend < 1000 images for best performance
3. **Cache issues**: Clear browser cache or use refresh button

### Mobile Issues
1. **Viewport**: Ensure proper mobile viewport meta tag
2. **Touch targets**: Buttons automatically sized for touch
3. **Loading**: Images load progressively on mobile

## 📊 Analytics & Monitoring

### Built-in Logging
The system logs important events to browser console:
```javascript
// Check console for these messages:
✅ Google Drive API initialized
📸 X images cached
🎯 Catalog ready - seamless customer experience
```

### Performance Monitoring
- **First load**: ~2-5 seconds (depending on image count)
- **Cached loads**: < 1 second
- **Image loading**: Progressive background loading

## 🔄 Updates & Maintenance

### Adding New Products
1. Update `JULY PROMO.xlsx` with new products
2. Add corresponding images to Google Drive
3. Deploy updated Excel file
4. Images will auto-map on next cache refresh (24 hours)

### Monthly Updates
1. Update promotional prices in Excel
2. Add new product images to Google Drive
3. Update header text for new month/promotion
4. Test on staging before deploying

### Cache Management
- **Automatic**: Cache refreshes every 24 hours
- **Manual**: Use "🔄 Refresh Images" button (admin only)
- **Clear cache**: Delete browser localStorage for complete reset

## 🛡️ Security & Privacy

### Data Protection
- **No personal data**: Catalog doesn't collect customer information
- **Public images**: Only publicly shared Google Drive images
- **HTTPS required**: Secure connection for API calls

### API Security
- **Restricted API key**: Limit to Google Drive API only
- **Domain restrictions**: Add your domain to API key restrictions
- **Read-only access**: System only reads images, never modifies

## 📈 Performance Optimization

### Best Practices
1. **Optimize images**: Use WebP format when possible
2. **Limit file sizes**: Keep images under 500KB
3. **Regular cleanup**: Remove unused images from Google Drive
4. **Monitor cache**: Check console for cache hit rates

### Loading Strategy
- **Critical path**: Excel data loads first
- **Progressive images**: Images load in background
- **Lazy loading**: Images load as needed
- **Caching**: 24-hour intelligent cache system

## 👥 Team & Credits

### Development Team
- **Design & Development**: [Black Orchid Consulting](https://www.blackorchid.online)
- **Client**: OZZ Cash & Carry
- **Project Type**: E-commerce Catalog Solution

### Technology Stack
- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Data**: Excel (XLSX.js), Google Drive API v3
- **Hosting**: GitHub Pages
- **Images**: Google Drive CDN

### Open Source Libraries
- **XLSX.js**: Excel file reading
- **Tailwind CSS**: Responsive styling
- **Google Drive API**: Image management

## 📞 Contact & Support

### OZZ Cash & Carry
- **Phone**: [+27 31 332 7192](tel:+27313327192)
- **Address**: 40 Mazeppa & Gull Street, Durban, KwaZulu-Natal 4001
- **Hours**: Monday-Friday 8:00 AM - 5:00 PM, Saturday 8:00 AM - 1:00 PM

### Technical Support
- **Developer**: Black Orchid Consulting
- **Website**: [www.blackorchid.online](https://www.blackorchid.online)
- **Support**: For technical issues or customizations

### Quick Support Checklist
Before contacting support, please check:
- [ ] All images are publicly shared on Google Drive
- [ ] Excel file is named exactly `JULY PROMO.xlsx`
- [ ] API key is valid and unrestricted
- [ ] Browser console shows no error messages
- [ ] Internet connection is stable

---

## 📄 License

This project is proprietary software developed for OZZ Cash & Carry by Black Orchid Consulting. Unauthorized reproduction or distribution is prohibited.

**Last Updated**: July 2025  
**Version**: 1.0  
**Compatibility**: Modern browsers (Chrome, Firefox, Safari, Edge)

---

*For the latest updates and documentation, visit the repository or contact [Black Orchid Consulting](https://www.blackorchid.online).*
