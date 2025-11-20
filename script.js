// GitHub API configuration
const USERNAME = 'oaksahdow';
const GITHUB_API = `https://api.github.com/users/${USERNAME}`;

// DOM Elements
const repoCountEl = document.getElementById('repo-count');
const followerCountEl = document.getElementById('follower-count');
const starCountEl = document.getElementById('star-count');
const reposListEl = document.getElementById('repos-list');
const languageChartEl = document.getElementById('languageChart');

// Fetch GitHub data
async function fetchGitHubData() {
    try {
        // Fetch user data
        const userResponse = await fetch(GITHUB_API);
        const userData = await userResponse.json();

        // Fetch repositories
        const reposResponse = await fetch(`${GITHUB_API}/repos`);
        const reposData = await reposResponse.json();

        // Update stats
        updateStats(userData, reposData);
        
        // Create chart
        createLanguageChart(reposData);
        
        // Display repositories
        displayRepositories(reposData);

    } catch (error) {
        console.error('Erro ao buscar dados do GitHub:', error);
    }
}

// Update statistics
function updateStats(userData, reposData) {
    repoCountEl.textContent = userData.public_repos;
    followerCountEl.textContent = userData.followers;
    
    // Calculate total stars
    const totalStars = reposData.reduce((total, repo) => total + repo.stargazers_count, 0);
    starCountEl.textContent = totalStars;
}

// Create language chart
function createLanguageChart(reposData) {
    const languages = {};
    
    reposData.forEach(repo => {
        if (repo.language) {
            languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
    });

    const ctx = languageChartEl.getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(languages),
            datasets: [{
                data: Object.values(languages),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                    '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Linguagens dos Repositórios'
                }
            }
        }
    });
}

// Display repositories list
function displayRepositories(reposData) {
    const reposHTML = reposData
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .map(repo => `
            <div class="repo-item">
                <div class="repo-info">
                    <div class="repo-name">${repo.name}</div>
                    <div class="repo-description">${repo.description || 'Sem descrição'}</div>
                </div>
                <div class="repo-stats">
                    ⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count}
                </div>
            </div>
        `).join('');

    reposListEl.innerHTML = reposHTML;
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', fetchGitHubData);
