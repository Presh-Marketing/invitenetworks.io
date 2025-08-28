let currentQuestion = 1;
const totalQuestions = 8;
let answers = {};

// Initialize quiz
document.addEventListener('DOMContentLoaded', function() {
    updateProgress();
    attachEventListeners();
});

function attachEventListeners() {
    // Add event listeners to all radio buttons
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            // Store the answer
            answers[this.name] = this.value;
            
            // Auto-advance after a short delay
            setTimeout(() => {
                if (currentQuestion < totalQuestions) {
                    nextQuestion();
                } else {
                    showResults();
                }
            }, 700);
        });
    });
}

function nextQuestion() {
    // Hide current question
    const currentSlide = document.querySelector('.question-slide.active');
    currentSlide.style.opacity = '0';
    currentSlide.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        currentSlide.classList.remove('active');
        
        // Show next question
        currentQuestion++;
        const nextSlide = document.querySelector(`[data-question="${currentQuestion}"]`);
        if (nextSlide) {
            nextSlide.classList.add('active');
            updateProgress();
        }
    }, 300);
}

function updateProgress() {
    const progress = (currentQuestion / totalQuestions) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressText').textContent = `Question ${currentQuestion} of ${totalQuestions}`;
}

function calculateProfile() {
    // Count answers for each profile type
    const scores = {
        diy: 0,
        enterprise: 0,
        managed: 0
    };

    // Count votes for each profile
    Object.values(answers).forEach(answer => {
        if (scores.hasOwnProperty(answer)) {
            scores[answer]++;
        }
    });

    // Determine the profile with the highest score
    const maxScore = Math.max(...Object.values(scores));
    const profile = Object.keys(scores).find(key => scores[key] === maxScore);

    return {
        profile: profile,
        scores: scores,
        total: Object.keys(answers).length
    };
}

function getResultData(profileResult) {
    const profiles = {
        diy: {
            title: '🔧 DIY-Ready Infrastructure',
            description: 'You have the expertise and preferences for building and managing your own AI infrastructure. Your team values control, customization, and has the technical capabilities to handle complex implementations.',
            className: 'score-capable',
            recommendations: [
                'Build on open-source Kubernetes with GPU orchestration capabilities',
                'Implement custom monitoring and observability solutions for AI workloads',
                'Design flexible, modular architecture that can scale with your needs',
                'Establish robust DevOps practices for ML model deployment pipelines'
            ],
            nextSteps: 'Start with a pilot implementation focusing on container orchestration and GPU resource management. Consider partnering with infrastructure specialists for initial architecture design while maintaining full operational control.'
        },
        enterprise: {
            title: '🏢 Enterprise Infrastructure Required',
            description: 'You need a balanced approach that provides enterprise-grade reliability and support while maintaining some level of control and customization. A hybrid or managed enterprise solution would serve you well.',
            className: 'score-emerging',
            recommendations: [
                'Implement enterprise-grade AI platforms with managed components',
                'Utilize hybrid cloud strategies for optimal cost and performance',
                'Establish service-level agreements with infrastructure partners',
                'Focus on integration capabilities and API-driven management'
            ],
            nextSteps: 'Evaluate enterprise AI platforms that offer the right balance of managed services and customization. Plan a phased migration approach starting with non-critical workloads to validate the infrastructure strategy.'
        },
        managed: {
            title: '☁️ Fully Managed Infrastructure Advised',
            description: 'A fully managed AI infrastructure solution is ideal for your needs. This approach will allow your team to focus on AI applications and business outcomes while ensuring reliable, compliant, and optimized infrastructure.',
            className: 'score-ready',
            recommendations: [
                'Leverage cloud-native AI platforms with full infrastructure management',
                'Implement automated scaling and optimization for cost efficiency',
                'Ensure comprehensive compliance and security coverage',
                'Focus resources on AI model development and business applications'
            ],
            nextSteps: 'Begin evaluating managed AI infrastructure providers that meet your compliance requirements. Establish pilot programs to test integration with your existing systems while planning for rapid deployment of production workloads.'
        }
    };

    return profiles[profileResult.profile] || profiles.managed;
}

function showResults() {
    // Hide current question and progress
    const currentSlide = document.querySelector('.question-slide.active');
    currentSlide.style.opacity = '0';
    currentSlide.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        currentSlide.classList.remove('active');
        document.querySelector('.progress-container').style.display = 'none';
        
        // Calculate and display results
        const profileResult = calculateProfile();
        const resultData = getResultData(profileResult);
        
        // Display profile percentage
        const percentage = Math.round((profileResult.scores[profileResult.profile] / profileResult.total) * 100);
        document.getElementById('scoreCircle').textContent = percentage + '%';
        document.getElementById('scoreCircle').className = `score-circle ${resultData.className}`;
        document.getElementById('resultTitle').textContent = resultData.title;
        document.getElementById('resultDescription').textContent = resultData.description;
        
        // Populate recommendations
        const recommendationsList = document.getElementById('recommendationsList');
        recommendationsList.innerHTML = '';
        resultData.recommendations.forEach((rec, index) => {
            const li = document.createElement('li');
            li.className = 'recommendation-item';
            li.innerHTML = `
                <span class="recommendation-number">${index + 1}</span>
                <span class="recommendation-text">${rec}</span>
            `;
            recommendationsList.appendChild(li);
        });
        
        // Add next steps text
        const nextStepsText = document.getElementById('nextStepsText');
        nextStepsText.textContent = resultData.nextSteps;
        
        // Show results container with animation
        const resultsContainer = document.getElementById('resultsContainer');
        resultsContainer.classList.add('active');

        // Store results for potential form submission
        window.quizProfile = profileResult.profile;
        window.quizAnswers = answers;
        window.quizResultData = resultData;
        window.profileScores = profileResult.scores;
    }, 300);
}

function showLeadForm() {
    const leadForm = document.getElementById('leadForm');
    leadForm.classList.add('active');
    document.querySelector('.show-form-button').style.display = 'none';
    
    // Pre-populate form with quiz data if possible
    populateMailchimpForm();
    
    // Scroll to form smoothly
    setTimeout(() => {
        leadForm.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
    }, 100);
}

function populateMailchimpForm() {
    // Store quiz results in the form for potential follow-up
    const form = document.getElementById('mc-embedded-subscribe-form');
    if (form && window.quizProfile) {
        // Add hidden field for quiz profile
        const profileField = document.createElement('input');
        profileField.type = 'hidden';
        profileField.name = 'PROFILE';
        profileField.value = window.quizProfile;
        form.appendChild(profileField);
        
        // Add hidden field for quiz scores
        const scoresField = document.createElement('input');
        scoresField.type = 'hidden';
        scoresField.name = 'SCORES';
        scoresField.value = JSON.stringify(window.profileScores);
        form.appendChild(scoresField);
    }
}

// Add keyboard navigation for accessibility
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && currentQuestion <= totalQuestions) {
        const activeQuestion = document.querySelector('.question-slide.active');
        if (activeQuestion) {
            const checkedRadio = activeQuestion.querySelector('input[type="radio"]:checked');
            if (checkedRadio) {
                checkedRadio.dispatchEvent(new Event('change'));
            }
        }
    }
});

// Add number key shortcuts (1-6) for quick answer selection
document.addEventListener('keydown', function(event) {
    const num = parseInt(event.key);
    if (num >= 1 && num <= 6 && currentQuestion <= totalQuestions) {
        const activeQuestion = document.querySelector('.question-slide.active');
        if (activeQuestion) {
            const radioButtons = activeQuestion.querySelectorAll('input[type="radio"]');
            if (radioButtons[num - 1]) {
                radioButtons[num - 1].checked = true;
                radioButtons[num - 1].dispatchEvent(new Event('change'));
            }
        }
    }
});
