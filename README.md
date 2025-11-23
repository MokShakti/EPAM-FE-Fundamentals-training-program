# Best Shop - Suitcase E-Shop

Multi-page online store for suitcases and travel accessories. A fully responsive e-commerce website built with HTML, CSS (SASS), and JavaScript without any frameworks.

## Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (Node Package Manager, comes with Node.js)

## Project Setup

### 1. Install Dependencies

Clone the repository locally, then navigate to the project directory and run:

```bash
npm install
```

This will install all necessary dependencies from `package.json`, including SASS compiler, ESLint, Stylelint, and development tools.

### 2. Compile SASS

The project uses SASS for styling. All `.scss` files are located in the `src/scss` directory and are compiled into `.css` files in the `dist/css` directory.

To compile SASS files, use:

```bash
npm run compile
```

### 3. Run Development Server

To compile SASS and watch for changes automatically, run:

```bash
npm run dev
```

This command will:
- Compile all `.scss` files from `src/scss` to `dist/css`
- Watch for changes and recompile automatically
- Start a live-server on port 3000
- Open the homepage in your browser

**Note:** The project should be run using only two scripts:
- `npm install` (to install dependencies)
- `npm run dev` (to compile and launch the project)

### 4. Code Quality

To check code quality with ESLint and Stylelint, run:

```bash
npm run lint
```

## Project Structure

```
fundamentals-project-template/
├── src/
│   ├── assets/
│   │   └── data.json          # Product data in JSON format
│   ├── scss/                  # SASS source files
│   │   ├── abstracts/         # Variables, mixins, resets
│   │   │   ├── _variables.scss
│   │   │   ├── _mixins.scss
│   │   │   └── _reset.scss
│   │   ├── components/        # Reusable components
│   │   │   └── _buttons.scss
│   │   ├── layouts/           # Layout styles (header, footer, responsive)
│   │   │   ├── _header.scss
│   │   │   ├── _footer.scss
│   │   │   └── _responsive.scss
│   │   ├── pages/             # Page-specific styles
│   │   │   ├── _catalog.scss
│   │   │   ├── _product-details.scss
│   │   │   ├── _cart.scss
│   │   │   ├── _contact.scss
│   │   │   └── _about.scss
│   │   └── main.scss          # Main SASS file
│   ├── js/                    # JavaScript files
│   │   ├── main.js            # Shared functionality (cart, modal, navigation)
│   │   ├── home.js            # Homepage logic
│   │   ├── catalog.js          # Catalog page logic (filtering, sorting, search)
│   │   ├── product.js         # Product details page
│   │   ├── cart.js            # Cart page logic
│   │   └── contact.js         # Contact page logic
│   ├── html/                  # Additional HTML pages
│   │   ├── catalog.html
│   │   ├── product.html
│   │   ├── cart.html
│   │   ├── contact.html
│   │   └── about.html
│   ├── img/                   # Images (webp, svg, png)
│   ├── fonts/                 # Font files
│   └── index.html             # Homepage
├── dist/
│   └── css/                   # Compiled CSS files (generated)
├── package.json               # Project dependencies and scripts
├── .eslintrc.json             # ESLint configuration
├── .stylelintrc.json          # Stylelint configuration
└── README.md                  # This file
```

## Features

### Pages

- **Homepage** - Featured products carousel, highlighted categories, random hero text, Travel Suitcases slider with hover effects
- **Catalog** - Product filtering, sorting, search, pagination (12 items per page), Top Best Sets
- **Product Details** - Detailed product information with reviews, quantity selector, related products
- **About Us** - Company information and team members, "See All Models" button
- **Contact Us** - Contact form with real-time validation
- **Cart** - Shopping cart management with LocalStorage persistence, discount calculation (10% if total > $3000), checkout functionality

### Functionality

#### Navigation
- **Header Navigation**: Logo click navigates to homepage, menu items change color on hover (#B92770), clicking menu items navigates to corresponding pages
- **Footer Navigation**: Clicking "About Us" or "Contact Us" navigates to respective pages
- **Account Icon**: Opens Log In modal window with email validation (RegEx), password required field, show/hide password toggle
- **Cart Icon**: Opens Cart page, cart counter updates in real-time

#### Homepage
- Travel Suitcases block with image slider, hover effects (zoom and shadow)
- Random text displayed over hero background image
- Selected Products and New Products Arrival loaded from JSON
- Add to Cart button updates cart counter and saves to LocalStorage
- Product card click navigates to Product Details page

#### Catalog Page
- **Filtering**: Works with local JSON data by category, color, size, and salesStatus
- **Sorting**: By price (lowest/highest), popularity, and rating
- **Search**: Searches in JSON data, if single product found - opens Product Details, if not found - shows pop-up
- **Pagination**: 12 products per page, previous/next buttons, asynchronous loading, "Showing X–Y of Z Results"
- **Top Best Sets**: Random suitcase sets displayed

#### Product Details Page
- Loads dynamically from JSON data
- Quantity selector (+/-) with minimum value of 1
- Add to Cart updates header counter and LocalStorage
- Review tab form shows success/error message without page reload
- "You May Also Like" displays 4 randomly selected products

#### Cart Page
- **Add Items**: Merges entries if name, size, and color match, keeps separate if only name matches
- **Update Items**: Quantity +/- updates immediately, total price recalculated instantly
- **Remove Items**: Delete button removes product, updates total and counter
- **Clear Cart**: Deletes all items, shows empty cart message, hides cart counter
- **Checkout**: Clears cart, shows "Thank you for your purchase" message, hides cart counter
- **Discount**: 10% discount applied when subtotal exceeds $3000

#### Contact Us Page
- Real-time email format validation
- Required fields validation
- Success/error message on submit without page reload

### Responsive Design

- Mobile-first approach
- Breakpoints: 375px, 425px, 768px, 1024px, 1440px
- Hamburger menu for screens ≤ 1023px
- Adaptive font sizes using `clamp()`
- Adaptive spacing (padding, margin, gap) using `clamp()`
- No horizontal scrolling at any resolution
- Images maintain aspect ratio
- Tested in Chrome and Firefox

### Technical Features

- **LocalStorage**: Cart data persisted in browser LocalStorage
- **Dynamic Content**: Products loaded from JSON file
- **Performance**: Lazy loading for images, preconnect for fonts
- **Code Quality**: ESLint for JavaScript, Stylelint for SCSS/CSS
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation support

## Browser Support

The website has been tested and works in:
- Chrome
- Firefox
- Safari
- Edge

## Technologies Used

- **HTML5** (semantic markup)
- **CSS3** (with SASS/SCSS, mixins, variables, inheritance)
- **JavaScript** (Vanilla JS, no frameworks)
- **LocalStorage API** (for cart persistence)
- **Flexbox and CSS Grid** (for layouts)
- **ESLint** (for JavaScript code quality)
- **Stylelint** (for SCSS/CSS code quality)

## Development Notes

- All styles must be compiled from SASS before viewing
- The project uses CSS variables for colors, spacing, and breakpoints
- JavaScript is organized in separate files per page
- Product data is loaded from `src/assets/data.json`
- Cart data is persisted in browser LocalStorage with key `bestshop_cart`
- All comments have been removed from JS, HTML, SCSS, and CSS files
- Font sizes and spacing use `clamp()` for adaptive responsiveness
- Mobile-first design approach implemented

## Scripts

- `npm install` - Install all dependencies
- `npm run dev` - Compile SASS and start development server with live reload
- `npm run compile` - Compile SASS files to CSS
- `npm run lint` - Run ESLint and Stylelint to check code quality

## License

ISC
