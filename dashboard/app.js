/* ============================================
   RMS TITANIC — ML Dashboard JavaScript
   Charts, Animations, Particles & Prediction
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    //  DATA (extracted from trained models)
    // =============================================
    const DATA = {
        rf: {
            name: 'Random Forest',
            accuracy: 79.89,
            precision: 82.35,
            recall: 60.87,
            f1: 70.00,
            cm: [[101, 9], [27, 42]]
        },
        lr: {
            name: 'Regresión Logística',
            accuracy: 80.45,
            precision: 79.31,
            recall: 66.67,
            f1: 72.44,
            cm: [[98, 12], [23, 46]]
        },
        featureImportance: [
            { name: 'Sexo (F)', value: 0.2538 },
            { name: 'Sexo (M)', value: 0.2137 },
            { name: 'Tarifa', value: 0.1723 },
            { name: 'Edad', value: 0.1427 },
            { name: 'Clase', value: 0.1300 },
            { name: 'Hermanos', value: 0.0463 },
            { name: 'Emb. S', value: 0.0212 },
            { name: 'Emb. C', value: 0.0122 },
            { name: 'Emb. Q', value: 0.0078 }
        ],
        dataset: {
            total: 891,
            survived: 342,
            perished: 549,
            classDist: { '1st': 216, '2nd': 184, '3rd': 491 },
            sexDist: { 'Masculino': 577, 'Femenino': 314 },
            survByClass: { '1ª Clase': 62.96, '2ª Clase': 47.28, '3ª Clase': 24.24 },
            survBySex: { 'Femenino': 74.20, 'Masculino': 18.89 },
            survByEmbarked: { 'Cherbourg': 55.36, 'Queenstown': 38.96, 'Southampton': 33.90 }
        }
    };

    // =============================================
    //  COLOR PALETTE
    // =============================================
    const COLORS = {
        gold: '#d4a853',
        goldLight: '#f0d890',
        cyan: '#4fc3f7',
        cyanDark: '#0288d1',
        rose: '#ef5350',
        roseLight: '#ff8a80',
        emerald: '#66bb6a',
        emeraldDark: '#2e7d32',
        textSecondary: 'rgba(232, 230, 227, 0.65)',
        textMuted: 'rgba(232, 230, 227, 0.4)',
        gridLine: 'rgba(255, 255, 255, 0.06)',
        purple: '#ab47bc'
    };

    // =============================================
    //  PARTICLES BACKGROUND
    // =============================================
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticles() {
        particles = [];
        const count = Math.floor((canvas.width * canvas.height) / 18000);
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.8 + 0.3,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: -Math.random() * 0.4 - 0.1,
                opacity: Math.random() * 0.4 + 0.1,
                hue: Math.random() > 0.7 ? 38 : 200
            });
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
            if (p.x < -10) p.x = canvas.width + 10;
            if (p.x > canvas.width + 10) p.x = -10;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue}, 60%, 70%, ${p.opacity})`;
            ctx.fill();
        });
        requestAnimationFrame(animateParticles);
    }

    resizeCanvas();
    createParticles();
    animateParticles();
    window.addEventListener('resize', () => { resizeCanvas(); createParticles(); });

    // =============================================
    //  NAVIGATION SCROLL
    // =============================================
    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
    });

    // =============================================
    //  SCROLL ANIMATIONS
    // =============================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Trigger specific animations
                if (entry.target.id === 'card-rf' || entry.target.id === 'card-lr') {
                    animateModelCard(entry.target);
                }
                if (entry.target.querySelector('.feature-item')) {
                    animateFeatures();
                }
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    // =============================================
    //  COUNTER ANIMATION
    // =============================================
    function animateCounter(el, target, duration = 1500) {
        let start = 0;
        const step = target / (duration / 16);
        const isFloat = String(target).includes('.');
        function update() {
            start += step;
            if (start >= target) {
                el.textContent = isFloat ? target : Math.round(target);
                return;
            }
            el.textContent = isFloat ? start.toFixed(1) : Math.round(start);
            requestAnimationFrame(update);
        }
        update();
    }

    // Observe stat cards for counter animations
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const val = entry.target.querySelector('.stat-card__value');
                const count = val.dataset.count;
                if (count) {
                    animateCounter(val, parseFloat(count));
                    val.dataset.count = '';
                }
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.stat-card').forEach(el => statObserver.observe(el));

    // =============================================
    //  MODEL CARD ANIMATIONS
    // =============================================
    function animateModelCard(card) {
        // Animate metric bars
        setTimeout(() => {
            card.querySelectorAll('.metric-row__fill').forEach(bar => {
                bar.style.width = bar.dataset.width + '%';
            });
        }, 300);

        // Animate accuracy ring
        const ring = card.querySelector('.accuracy-ring__fill');
        if (ring) {
            const pct = parseFloat(ring.dataset.pct);
            const circumference = 2 * Math.PI * 52;
            const offset = circumference - (pct / 100) * circumference;
            setTimeout(() => {
                ring.style.strokeDashoffset = offset;
            }, 200);

            // Animate accuracy value
            const accId = card.id === 'card-rf' ? 'acc-rf' : 'acc-lr';
            const accEl = document.getElementById(accId);
            let current = 0;
            const target = pct;
            const step = target / (1800 / 16);
            function updateAcc() {
                current += step;
                if (current >= target) {
                    accEl.textContent = target.toFixed(1) + '%';
                    return;
                }
                accEl.textContent = current.toFixed(1) + '%';
                requestAnimationFrame(updateAcc);
            }
            setTimeout(updateAcc, 200);
        }
    }

    // =============================================
    //  FEATURE IMPORTANCE BARS
    // =============================================
    const featureBarsContainer = document.getElementById('feature-bars');
    const maxImportance = DATA.featureImportance[0].value;

    DATA.featureImportance.forEach((feat, i) => {
        const pct = (feat.value / maxImportance) * 100;
        const item = document.createElement('div');
        item.className = 'feature-item';
        item.innerHTML = `
            <span class="feature-item__name">${feat.name}</span>
            <div class="feature-item__bar-wrap">
                <div class="feature-item__bar" data-width="${pct}"></div>
            </div>
            <span class="feature-item__value">${(feat.value * 100).toFixed(1)}%</span>
        `;
        featureBarsContainer.appendChild(item);
    });

    function animateFeatures() {
        document.querySelectorAll('.feature-item__bar').forEach((bar, i) => {
            setTimeout(() => {
                bar.style.width = bar.dataset.width + '%';
            }, i * 100);
        });
    }

    // Observe feature container
    const featObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateFeatures();
                featObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    featObserver.observe(featureBarsContainer);

    // =============================================
    //  CANVAS CHART UTILITIES
    // =============================================
    function getCanvasContext(id) {
        const c = document.getElementById(id);
        const dpr = window.devicePixelRatio || 1;
        const rect = c.getBoundingClientRect();
        c.width = rect.width * dpr;
        c.height = rect.height * dpr;
        c.style.width = rect.width + 'px';
        c.style.height = rect.height + 'px';
        const cx = c.getContext('2d');
        cx.scale(dpr, dpr);
        return { cx, w: rect.width, h: rect.height };
    }

    // =============================================
    //  DONUT CHART — Survival Distribution
    // =============================================
    function drawDonut() {
        const { cx, w, h } = getCanvasContext('chart-survival-donut');
        const centerX = w / 2, centerY = h / 2;
        const radius = Math.min(w, h) / 2.5;
        const lineWidth = 30;
        const total = DATA.dataset.total;
        const survived = DATA.dataset.survived;
        const perished = DATA.dataset.perished;

        const segments = [
            { value: perished, color: COLORS.rose, label: 'Fallecidos' },
            { value: survived, color: COLORS.emerald, label: 'Sobrevivientes' }
        ];

        let startAngle = -Math.PI / 2;
        segments.forEach(seg => {
            const sliceAngle = (seg.value / total) * 2 * Math.PI;
            cx.beginPath();
            cx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
            cx.strokeStyle = seg.color;
            cx.lineWidth = lineWidth;
            cx.lineCap = 'round';
            cx.stroke();
            startAngle += sliceAngle + 0.04;
        });

        // Center text
        cx.fillStyle = '#e8e6e3';
        cx.font = '700 28px Cinzel, serif';
        cx.textAlign = 'center';
        cx.textBaseline = 'middle';
        cx.fillText(total, centerX, centerY - 10);
        cx.fillStyle = COLORS.textSecondary;
        cx.font = '400 12px Inter, sans-serif';
        cx.fillText('pasajeros', centerX, centerY + 16);

        // Legend
        const legendY = h - 20;
        segments.forEach((seg, i) => {
            const lx = centerX + (i === 0 ? -70 : 20);
            cx.beginPath();
            cx.arc(lx, legendY, 5, 0, Math.PI * 2);
            cx.fillStyle = seg.color;
            cx.fill();
            cx.fillStyle = COLORS.textSecondary;
            cx.font = '400 11px Inter, sans-serif';
            cx.textAlign = 'left';
            cx.fillText(`${seg.label} (${((seg.value / total) * 100).toFixed(1)}%)`, lx + 10, legendY + 4);
        });
    }

    // =============================================
    //  BAR CHART UTILITY
    // =============================================
    function drawBarChart(canvasId, labels, values, colors, isPercentage = false) {
        const { cx, w, h } = getCanvasContext(canvasId);
        const padding = { top: 20, right: 20, bottom: 50, left: 50 };
        const chartW = w - padding.left - padding.right;
        const chartH = h - padding.top - padding.bottom;
        const barWidth = Math.min(chartW / labels.length * 0.6, 50);
        const gap = chartW / labels.length;
        const maxVal = Math.max(...values) * 1.15;

        // Grid lines
        cx.strokeStyle = COLORS.gridLine;
        cx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (chartH / 4) * i;
            cx.beginPath();
            cx.moveTo(padding.left, y);
            cx.lineTo(w - padding.right, y);
            cx.stroke();

            const val = maxVal - (maxVal / 4) * i;
            cx.fillStyle = COLORS.textMuted;
            cx.font = '400 10px Inter, sans-serif';
            cx.textAlign = 'right';
            cx.fillText(isPercentage ? val.toFixed(0) + '%' : Math.round(val), padding.left - 8, y + 4);
        }

        // Bars
        labels.forEach((label, i) => {
            const barH = (values[i] / maxVal) * chartH;
            const x = padding.left + gap * i + (gap - barWidth) / 2;
            const y = padding.top + chartH - barH;

            // Bar gradient
            const grad = cx.createLinearGradient(x, y, x, y + barH);
            grad.addColorStop(0, colors[i] || COLORS.gold);
            grad.addColorStop(1, hexToRgba(colors[i] || COLORS.gold, 0.3));

            // Rounded rect
            const r = 4;
            cx.beginPath();
            cx.moveTo(x + r, y);
            cx.lineTo(x + barWidth - r, y);
            cx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + r);
            cx.lineTo(x + barWidth, y + barH);
            cx.lineTo(x, y + barH);
            cx.lineTo(x, y + r);
            cx.quadraticCurveTo(x, y, x + r, y);
            cx.fillStyle = grad;
            cx.fill();

            // Value on top
            cx.fillStyle = '#e8e6e3';
            cx.font = '600 11px Inter, sans-serif';
            cx.textAlign = 'center';
            cx.fillText(isPercentage ? values[i].toFixed(1) + '%' : values[i], x + barWidth / 2, y - 8);

            // Label
            cx.fillStyle = COLORS.textSecondary;
            cx.font = '400 11px Inter, sans-serif';
            cx.textAlign = 'center';
            cx.fillText(label, x + barWidth / 2, h - padding.bottom + 20);
        });
    }

    function hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // =============================================
    //  RADAR CHART — Metrics Comparison
    // =============================================
    function drawRadar() {
        const { cx, w, h } = getCanvasContext('chart-metrics-radar');
        const centerX = w / 2, centerY = h / 2;
        const radius = Math.min(w, h) / 2.8;
        const metrics = ['Accuracy', 'Precision', 'Recall', 'F1-Score'];
        const rfValues = [DATA.rf.accuracy, DATA.rf.precision, DATA.rf.recall, DATA.rf.f1];
        const lrValues = [DATA.lr.accuracy, DATA.lr.precision, DATA.lr.recall, DATA.lr.f1];
        const numAxes = metrics.length;
        const angleStep = (2 * Math.PI) / numAxes;

        // Background rings
        [0.25, 0.5, 0.75, 1.0].forEach(scale => {
            cx.beginPath();
            for (let i = 0; i <= numAxes; i++) {
                const angle = -Math.PI / 2 + angleStep * i;
                const x = centerX + Math.cos(angle) * radius * scale;
                const y = centerY + Math.sin(angle) * radius * scale;
                i === 0 ? cx.moveTo(x, y) : cx.lineTo(x, y);
            }
            cx.strokeStyle = COLORS.gridLine;
            cx.lineWidth = 1;
            cx.stroke();
        });

        // Axes
        for (let i = 0; i < numAxes; i++) {
            const angle = -Math.PI / 2 + angleStep * i;
            cx.beginPath();
            cx.moveTo(centerX, centerY);
            cx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
            cx.strokeStyle = COLORS.gridLine;
            cx.stroke();

            // Labels
            const labelDist = radius + 24;
            const lx = centerX + Math.cos(angle) * labelDist;
            const ly = centerY + Math.sin(angle) * labelDist;
            cx.fillStyle = COLORS.textSecondary;
            cx.font = '500 12px Inter, sans-serif';
            cx.textAlign = 'center';
            cx.textBaseline = 'middle';
            cx.fillText(metrics[i], lx, ly);
        }

        // Draw data polygon
        function drawPoly(values, color, fillAlpha) {
            cx.beginPath();
            values.forEach((val, i) => {
                const angle = -Math.PI / 2 + angleStep * i;
                const r = (val / 100) * radius;
                const x = centerX + Math.cos(angle) * r;
                const y = centerY + Math.sin(angle) * r;
                i === 0 ? cx.moveTo(x, y) : cx.lineTo(x, y);
            });
            cx.closePath();
            cx.fillStyle = hexToRgba(color, fillAlpha);
            cx.fill();
            cx.strokeStyle = color;
            cx.lineWidth = 2;
            cx.stroke();

            // Dots
            values.forEach((val, i) => {
                const angle = -Math.PI / 2 + angleStep * i;
                const r = (val / 100) * radius;
                const x = centerX + Math.cos(angle) * r;
                const y = centerY + Math.sin(angle) * r;
                cx.beginPath();
                cx.arc(x, y, 4, 0, Math.PI * 2);
                cx.fillStyle = color;
                cx.fill();
                cx.strokeStyle = '#0a0e1a';
                cx.lineWidth = 2;
                cx.stroke();
            });
        }

        drawPoly(rfValues, COLORS.cyan, 0.12);
        drawPoly(lrValues, COLORS.gold, 0.12);

        // Legend
        const legendY = h - 16;
        [
            { label: 'Random Forest', color: COLORS.cyan, x: centerX - 100 },
            { label: 'Regresión Logística', color: COLORS.gold, x: centerX + 20 }
        ].forEach(item => {
            cx.beginPath();
            cx.arc(item.x, legendY, 5, 0, Math.PI * 2);
            cx.fillStyle = item.color;
            cx.fill();
            cx.fillStyle = COLORS.textSecondary;
            cx.font = '400 11px Inter, sans-serif';
            cx.textAlign = 'left';
            cx.fillText(item.label, item.x + 10, legendY + 4);
        });
    }

    // =============================================
    //  DRAW ALL CHARTS ON SCROLL
    // =============================================
    let chartsDrawn = { dataset: false, models: false, survival: false };

    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                if (sectionId === 'dataset' && !chartsDrawn.dataset) {
                    chartsDrawn.dataset = true;
                    drawDonut();
                    drawBarChart('chart-class-bar',
                        ['1ª Clase', '2ª Clase', '3ª Clase'],
                        [216, 184, 491],
                        [COLORS.gold, COLORS.cyan, COLORS.emerald]
                    );
                    drawBarChart('chart-sex-bar',
                        ['Masculino', 'Femenino'],
                        [577, 314],
                        [COLORS.cyan, COLORS.rose]
                    );
                }
                if (sectionId === 'models' && !chartsDrawn.models) {
                    chartsDrawn.models = true;
                    setTimeout(drawRadar, 400);
                }
                if (sectionId === 'survival' && !chartsDrawn.survival) {
                    chartsDrawn.survival = true;
                    drawBarChart('chart-surv-class',
                        ['1ª Clase', '2ª Clase', '3ª Clase'],
                        [62.96, 47.28, 24.24],
                        [COLORS.gold, COLORS.cyan, COLORS.rose],
                        true
                    );
                    drawBarChart('chart-surv-sex',
                        ['Femenino', 'Masculino'],
                        [74.20, 18.89],
                        [COLORS.emerald, COLORS.rose],
                        true
                    );
                    drawBarChart('chart-surv-embarked',
                        ['Cherbourg', 'Queenstown', 'Southampton'],
                        [55.36, 38.96, 33.90],
                        [COLORS.gold, COLORS.cyan, COLORS.emerald],
                        true
                    );
                }
            }
        });
    }, { threshold: 0.1 });

    ['dataset', 'models', 'survival'].forEach(id => {
        const el = document.getElementById(id);
        if (el) chartObserver.observe(el);
    });

    // =============================================
    //  PREDICTION (client-side heuristic)
    // =============================================
    document.getElementById('predict-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const pclass = parseInt(document.getElementById('input-pclass').value);
        const sex = document.getElementById('input-sex').value;
        const age = parseFloat(document.getElementById('input-age').value);
        const sibsp = parseInt(document.getElementById('input-sibsp').value);
        const parch = parseInt(document.getElementById('input-parch').value);
        const fare = parseFloat(document.getElementById('input-fare').value);
        const embarked = document.getElementById('input-embarked').value;

        // Heuristic scoring based on actual model insights
        // (mirrors the key patterns learned by both models)
        function predict(modelType) {
            let score = 0;

            // Sex is the strongest predictor
            if (sex === 'female') score += 3.5;
            else score -= 1.5;

            // Class
            if (pclass === 1) score += 1.8;
            else if (pclass === 2) score += 0.5;
            else score -= 1.0;

            // Age
            if (age < 10) score += 1.5;
            else if (age > 60) score -= 0.7;
            else if (age > 40) score -= 0.3;

            // Fare
            if (fare > 50) score += 1.0;
            else if (fare > 25) score += 0.3;
            else score -= 0.3;

            // Family
            if (sibsp + parch >= 1 && sibsp + parch <= 3) score += 0.3;
            else if (sibsp + parch > 4) score -= 0.5;

            // Embarked
            if (embarked === 'C') score += 0.3;

            // Model-specific tweaks
            if (modelType === 'rf') {
                // RF is more conservative with recall
                return score > 0.8;
            } else {
                // LR is slightly more generous
                return score > 0.5;
            }
        }

        const rfSurvived = predict('rf');
        const lrSurvived = predict('lr');

        const resultsDiv = document.getElementById('predict-results');
        resultsDiv.style.display = 'grid';

        // RF result
        const rfResult = document.getElementById('result-rf');
        rfResult.className = 'predict-result ' + (rfSurvived ? 'predict-result--survived' : 'predict-result--perished');
        document.getElementById('verdict-rf').textContent = rfSurvived ? '🛟 SOBREVIVE' : '🌊 NO SOBREVIVE';

        // LR result
        const lrResult = document.getElementById('result-lr');
        lrResult.className = 'predict-result ' + (lrSurvived ? 'predict-result--survived' : 'predict-result--perished');
        document.getElementById('verdict-lr').textContent = lrSurvived ? '🛟 SOBREVIVE' : '🌊 NO SOBREVIVE';

        // Re-trigger animation
        [rfResult, lrResult].forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight;
            el.style.animation = 'resultSlideIn 0.6s ease-out';
        });

        // Scroll to results
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    // =============================================
    //  SMOOTH SCROLL FOR NAV LINKS
    // =============================================
    document.querySelectorAll('.nav__links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});
