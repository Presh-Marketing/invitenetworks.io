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
    
    // Scroll to form smoothly
    setTimeout(() => {
        leadForm.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
    }, 100);
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const leadData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        company: formData.get('company'),
        title: formData.get('title'),
        phone: formData.get('phone'),
        recommendedProfile: window.quizProfile,
        profileScores: window.profileScores,
        quizAnswers: window.quizAnswers,
        timestamp: new Date().toISOString()
    };

    // Integration points for CRM/Marketing automation
    console.log('Lead data ready for integration:', leadData);
    
    // Example integrations (commented out - replace with actual endpoints):
    /*
    // HubSpot form submission
    const hubspotFormData = new FormData();
    hubspotFormData.append('firstname', leadData.firstName);
    hubspotFormData.append('lastname', leadData.lastName);
    hubspotFormData.append('email', leadData.email);
    hubspotFormData.append('company', leadData.company);
    hubspotFormData.append('jobtitle', leadData.title);
    hubspotFormData.append('phone', leadData.phone);
    hubspotFormData.append('ai_infrastructure_profile', leadData.recommendedProfile);
    
    fetch('https://api.hsforms.com/submissions/v3/integration/submit/YOUR_PORTAL_ID/YOUR_FORM_ID', {
        method: 'POST',
        body: hubspotFormData
    });
    
    // Salesforce Lead creation
    fetch('/api/salesforce/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
    });
    
    // Marketing automation tracking
    gtag('event', 'quiz_completion', {
        event_category: 'AI Infrastructure Assessment',
        event_label: leadData.recommendedProfile,
        custom_parameters: {
            company: leadData.company,
            job_title: leadData.title,
            infrastructure_profile: leadData.recommendedProfile
        }
    });
    */

    // Simulate form submission with enhanced UX
    const submitButton = event.target.querySelector('.cta-button');
    const originalText = submitButton.textContent;
    
    submitButton.innerHTML = `
        <span style="display: inline-flex; align-items: center; gap: 0.5rem;">
            <span style="animation: spin 1s linear infinite; display: inline-block;">⏳</span>
            Scheduling Your Strategy Session...
        </span>
    `;
    submitButton.disabled = true;
    submitButton.style.opacity = '0.8';

    // Add spinning animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
        // Success state
        submitButton.innerHTML = `
            <span style="display: inline-flex; align-items: center; gap: 0.5rem;">
                ✅ Strategy Session Scheduled Successfully!
            </span>
        `;
        submitButton.style.background = '#4CAF50';
        submitButton.style.opacity = '1';
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.style.cssText = `
            background: #4CAF50;
            color: white;
            padding: 1.5rem;
            border-radius: 12px;
            margin-top: 1.5rem;
            text-align: center;
            font-weight: 600;
            box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
        `;
        successMessage.innerHTML = `
            <h4 style="margin: 0 0 0.5rem 0; font-size: 1.3rem; text-transform: uppercase; letter-spacing: 1px;">🎉 Thank You!</h4>
            <p style="margin: 0; opacity: 0.95;">Your infrastructure strategy session has been scheduled. Our experts will contact you within 24 hours to discuss your ${window.quizProfile.toUpperCase()} infrastructure approach and next steps.</p>
        `;
        
        event.target.appendChild(successMessage);
        
        // In a real implementation, redirect to a thank you page
        // setTimeout(() => {
        //     window.location.href = `/thank-you?profile=${window.quizProfile}`;
        // }, 3000);
        
    }, 2500);
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