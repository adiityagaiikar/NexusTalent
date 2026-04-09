require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { bootstrapData } = require('./data/bootstrapData');
const { sanitizeMiddleware } = require('./middleware/sanitizeMiddleware');
const User = require('./models/User');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const crmRoutes = require('./routes/crmRoutes');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const eventRoutes = require('./routes/eventRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const productRoutes = require('./routes/productRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const { trendingProjects } = require('./data/defaultData');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);

app.use(
    cors({
        origin: [
            'http://localhost:5173',
            'http://localhost:5174',
            process.env.CLIENT_URL
        ].filter(Boolean),
        credentials: true,
    })
);

// OWASP Mitigation #3 (XSS Protection): secure headers + strict CSP.
app.use(
    helmet({
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", 'https://checkout.razorpay.com'],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", 'data:', 'https:'],
                connectSrc: ["'self'", process.env.CLIENT_URL || 'http://localhost:5173', 'https://api.razorpay.com'],
                frameSrc: ["'self'", 'https://checkout.razorpay.com'],
                objectSrc: ["'none'"],
                upgradeInsecureRequests: null,
            },
        },
        crossOriginEmbedderPolicy: false,
    })
);

app.use(express.json({ limit: '1mb' }));

// OWASP Mitigation #1 (NoSQL Injection): strip dangerous Mongo operators.
app.use(sanitizeMiddleware);

// OWASP Mitigation #2 (API Abuse / Brute Force): enforce request caps by IP.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many authentication attempts. Please retry later.' },
});

const dataLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many data requests. Please retry later.' },
});

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.get('/api/trending', (req, res) => {
    res.status(200).json(trendingProjects);
});

app.use('/api/auth', authLimiter, authRoutes);

// OWASP Mitigation #4 (Sensitive Data Exposure): explicitly exclude secret fields.
app.get('/api/data/users/:id', dataLimiter, async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password -__v -internalNotes');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        return next(error);
    }
});

app.use('/api/jobs', jobRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payments', paymentRoutes);

app.use(notFound);
app.use(errorHandler);

async function startServer() {
    await connectDB();
    await bootstrapData();

    app.listen(PORT, () => {
        console.log(`Backend running on http://localhost:${PORT}`);
    });
}

startServer().catch((error) => {
    console.error('Server startup failed:', error.message);
    process.exit(1);
});