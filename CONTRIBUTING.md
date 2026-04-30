# Contributing to Eco-Lender

Thank you for your interest in contributing to Eco-Lender! This document provides guidelines for contributing.

## Getting Started

1. **Fork the repository**

   ```bash
   git clone https://github.com/your-username/Eco_Lender.git
   cd Eco_Lender
   ```

2. **Create a branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make changes** following the code style

4. **Test your changes**

   ```bash
   npm test
   ```

5. **Commit with clear messages**

   ```bash
   git commit -m "feat: add new feature description"
   ```

6. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create Pull Request**

## Code Style

### JavaScript/React

- Use ES6+ syntax
- Follow ESLint rules
- Use meaningful variable names
- Add comments for complex logic

```javascript
// Good
const getUserLoans = async (userId) => {
  const loans = await Loan.find({ lender: userId });
  return loans;
};

// Bad
const getLoans = async (u) => {
  return Loan.find({ lender: u });
};
```

### CSS

- Use Tailwind CSS classes
- Follow mobile-first approach
- Keep specificity low

### Comments

```javascript
// Good: Explain WHY, not WHAT
// Fetch loans for the current user to display in dashboard
const loans = await fetchUserLoans(userId);

// Avoid: Obvious comments
// Set loans to empty array
const loans = [];
```

## Commit Messages

Use conventional commits format:

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: code style changes
refactor: code refactoring
test: add or update tests
chore: maintenance tasks
```

Examples:

```
feat: implement AI recommendation engine
fix: resolve CORS issues in production
docs: add deployment guide
refactor: optimize database queries
```

## Pull Request Process

1. **Update README** if needed
2. **Add tests** for new features
3. **Update documentation**
4. **Ensure no conflicts** with main branch
5. **Provide clear description** of changes

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change

## Testing

Steps to test the changes

## Checklist

- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
```

## Feature Request

Have an idea? Open an issue with:

- Clear title
- Detailed description
- Use cases
- Example mockups (if applicable)

## Bug Reports

Found a bug? Report with:

- Detailed description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/logs

## Development Setup

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Add your config
npm run dev

# Frontend (in new terminal)
cd frontend
npm install
cp .env.example .env
npm start
```

## Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Code Review

- Be respectful and constructive
- Focus on code, not person
- Suggest improvements
- Acknowledge good work

## Areas for Contribution

- **Frontend Components**: New UI components, pages
- **Backend Services**: API endpoints, business logic
- **Documentation**: README, guides, API docs
- **Tests**: Unit and integration tests
- **Performance**: Optimization opportunities
- **Security**: Vulnerability fixes
- **Translations**: Support for other languages
- **Design**: UI/UX improvements

## Project Structure

```
Eco-Lender/
├── backend/
│   ├── src/
│   │   ├── models/      # Database models
│   │   ├── routes/      # API endpoints
│   │   ├── controllers/ # Business logic
│   │   ├── services/    # Utilities
│   │   └── middleware/  # Auth, validation
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── redux/       # State management
│   │   └── services/    # API calls
│   └── public/
│
├── SETUP.md
├── API.md
└── DEPLOYMENT.md
```

## Naming Conventions

### Variables

```javascript
// Good
const userId = '123';
const isAuthenticated = true;
const userLoans = [];

// Bad
const uid = '123';
const auth = true;
const loans = [];
```

### Functions

```javascript
// Good
const getUserProfile = () => {};
const calculateTotalAmount = () => {};
const validateEmail = () => {};

// Bad
const getuser = () => {};
const calc = () => {};
const check = () => {};
```

### Components

```javascript
// Good: PascalCase
const UserProfile = () => {};
const ProjectCard = () => {};

// Bad: camelCase
const userProfile = () => {};
const projectCard = () => {};
```

## Performance Tips

- Minimize database queries
- Use pagination for large datasets
- Implement caching where appropriate
- Optimize images
- Use lazy loading for components

## Security Considerations

- Validate all user inputs
- Use parameterized queries
- Sanitize output
- Keep dependencies updated
- Use environment variables for secrets
- Implement rate limiting
- Use HTTPS in production

## Questions?

- Check existing issues
- Read documentation
- Ask in discussions
- Contact maintainers

## Recognition

Contributors will be recognized in:

- README.md
- Release notes
- GitHub contributors

---

Thank you for making Eco-Lender better! 🌱

**Last Updated**: April 2026
