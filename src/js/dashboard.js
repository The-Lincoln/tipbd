import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

let currentSection = 'overview';

async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = '/login.html';
        return false;
    }
    return session;
}

function loadSection(section) {
    currentSection = section;

    document.querySelectorAll('.dashboard-sidebar .nav-link').forEach(link => {
        link.classList.remove('active');
    });

    document.querySelector(`[data-section="${section}"]`).classList.add('active');

    const content = document.getElementById('mainContent');

    switch(section) {
        case 'overview':
            loadOverview(content);
            break;
        case 'leads':
            loadLeads(content);
            break;
        case 'crm':
            loadCRM(content);
            break;
        case 'projects':
            loadProjects(content);
            break;
        case 'tasks':
            loadTasks(content);
            break;
        case 'schedule':
            loadSchedule(content);
            break;
        case 'content':
            loadContentManager(content);
            break;
        case 'email':
            loadEmailTemplates(content);
            break;
        case 'products':
            loadProducts(content);
            break;
        case 'orders':
            loadOrders(content);
            break;
        case 'team':
            loadTeam(content);
            break;
    }
}

function loadOverview(content) {
    content.innerHTML = `
        <div class="dashboard-header">
            <h2 class="fw-bold">Dashboard Overview</h2>
            <p class="text-muted">Welcome back! Here's what's happening today.</p>
        </div>

        <div class="row g-4 mb-4">
            <div class="col-md-3">
                <div class="card stat-card shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="text-muted mb-2">Total Leads</h6>
                                <h3 class="fw-bold mb-0" id="totalLeads">0</h3>
                            </div>
                            <div class="fs-1 text-primary">
                                <i class="bi bi-person-plus"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card stat-card shadow-sm" style="border-left-color: #198754;">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="text-muted mb-2">Active Projects</h6>
                                <h3 class="fw-bold mb-0" id="activeProjects">0</h3>
                            </div>
                            <div class="fs-1 text-success">
                                <i class="bi bi-kanban"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card stat-card shadow-sm" style="border-left-color: #ffc107;">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="text-muted mb-2">Pending Tasks</h6>
                                <h3 class="fw-bold mb-0" id="pendingTasks">0</h3>
                            </div>
                            <div class="fs-1 text-warning">
                                <i class="bi bi-check2-square"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card stat-card shadow-sm" style="border-left-color: #dc3545;">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="text-muted mb-2">Revenue</h6>
                                <h3 class="fw-bold mb-0" id="totalRevenue">$0</h3>
                            </div>
                            <div class="fs-1 text-danger">
                                <i class="bi bi-currency-dollar"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row g-4">
            <div class="col-lg-8">
                <div class="card shadow-sm">
                    <div class="card-header bg-white">
                        <h5 class="mb-0">Recent Leads</h5>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-hover" id="recentLeadsTable">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="card shadow-sm">
                    <div class="card-header bg-white">
                        <h5 class="mb-0">Upcoming Events</h5>
                    </div>
                    <div class="card-body" id="upcomingEvents">
                        <p class="text-muted">No upcoming events</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    loadDashboardStats();
}

async function loadDashboardStats() {
    try {
        const { data: leads } = await supabase.from('leads').select('*');
        const { data: projects } = await supabase.from('projects').select('*').eq('status', 'active');
        const { data: tasks } = await supabase.from('tasks').select('*').neq('status', 'completed');
        const { data: orders } = await supabase.from('orders').select('total_amount');

        document.getElementById('totalLeads').textContent = leads?.length || 0;
        document.getElementById('activeProjects').textContent = projects?.length || 0;
        document.getElementById('pendingTasks').textContent = tasks?.length || 0;

        const revenue = orders?.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0) || 0;
        document.getElementById('totalRevenue').textContent = `$${revenue.toFixed(2)}`;

        if (leads && leads.length > 0) {
            const tbody = document.querySelector('#recentLeadsTable tbody');
            leads.slice(0, 5).forEach(lead => {
                const row = `
                    <tr>
                        <td>${lead.full_name}</td>
                        <td>${lead.email}</td>
                        <td><span class="badge bg-${getStatusColor(lead.status)}">${lead.status}</span></td>
                        <td>${new Date(lead.created_at).toLocaleDateString()}</td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        }
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

function loadLeads(content) {
    content.innerHTML = `
        <div class="dashboard-header">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h2 class="fw-bold">Lead Management</h2>
                    <p class="text-muted">Track and manage potential customers</p>
                </div>
                <button class="btn btn-primary" onclick="showAddLeadModal()">
                    <i class="bi bi-plus-circle me-2"></i>Add Lead
                </button>
            </div>
        </div>

        <div class="card shadow-sm">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover" id="leadsTable">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Company</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    loadLeadsData();
}

async function loadLeadsData() {
    try {
        const { data: leads, error } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const tbody = document.querySelector('#leadsTable tbody');
        tbody.innerHTML = '';

        if (leads && leads.length > 0) {
            leads.forEach(lead => {
                const row = `
                    <tr>
                        <td>${lead.full_name}</td>
                        <td>${lead.email}</td>
                        <td>${lead.phone || '-'}</td>
                        <td>${lead.company || '-'}</td>
                        <td><span class="badge bg-${getStatusColor(lead.status)}">${lead.status}</span></td>
                        <td><span class="badge bg-${getPriorityColor(lead.priority)}">${lead.priority}</span></td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary" onclick="editLead('${lead.id}')">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteLead('${lead.id}')">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        } else {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No leads found</td></tr>';
        }
    } catch (error) {
        console.error('Error loading leads:', error);
    }
}

function loadCRM(content) {
    content.innerHTML = `
        <div class="dashboard-header">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h2 class="fw-bold">Customer Relationship Management</h2>
                    <p class="text-muted">Manage customer relationships and interactions</p>
                </div>
                <button class="btn btn-primary" onclick="showAddCustomerModal()">
                    <i class="bi bi-plus-circle me-2"></i>Add Customer
                </button>
            </div>
        </div>

        <div class="card shadow-sm">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover" id="customersTable">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Company</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    loadCustomersData();
}

async function loadCustomersData() {
    try {
        const { data: customers, error } = await supabase
            .from('customers')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const tbody = document.querySelector('#customersTable tbody');
        tbody.innerHTML = '';

        if (customers && customers.length > 0) {
            customers.forEach(customer => {
                const row = `
                    <tr>
                        <td>${customer.full_name}</td>
                        <td>${customer.email}</td>
                        <td>${customer.phone || '-'}</td>
                        <td>${customer.company || '-'}</td>
                        <td><span class="badge bg-info">${customer.customer_type}</span></td>
                        <td><span class="badge bg-${customer.status === 'active' ? 'success' : 'secondary'}">${customer.status}</span></td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary" onclick="viewCustomer('${customer.id}')">
                                <i class="bi bi-eye"></i>
                            </button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        } else {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No customers found</td></tr>';
        }
    } catch (error) {
        console.error('Error loading customers:', error);
    }
}

function loadProjects(content) {
    content.innerHTML = `
        <div class="dashboard-header">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h2 class="fw-bold">Project Management</h2>
                    <p class="text-muted">Track and manage your projects</p>
                </div>
                <button class="btn btn-primary" onclick="showAddProjectModal()">
                    <i class="bi bi-plus-circle me-2"></i>New Project
                </button>
            </div>
        </div>

        <div class="row g-4" id="projectsGrid"></div>
    `;

    loadProjectsData();
}

async function loadProjectsData() {
    try {
        const { data: projects, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const grid = document.getElementById('projectsGrid');
        grid.innerHTML = '';

        if (projects && projects.length > 0) {
            projects.forEach(project => {
                const card = `
                    <div class="col-md-6 col-lg-4">
                        <div class="card shadow-sm h-100">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start mb-3">
                                    <h5 class="card-title">${project.name}</h5>
                                    <span class="badge bg-${getStatusColor(project.status)}">${project.status}</span>
                                </div>
                                <p class="card-text text-muted">${project.description || 'No description'}</p>
                                <div class="mb-2">
                                    <small class="text-muted">Priority: </small>
                                    <span class="badge bg-${getPriorityColor(project.priority)}">${project.priority}</span>
                                </div>
                                <div class="mb-2">
                                    <small class="text-muted">Due: ${project.due_date ? new Date(project.due_date).toLocaleDateString() : 'Not set'}</small>
                                </div>
                                <button class="btn btn-sm btn-outline-primary" onclick="viewProject('${project.id}')">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                grid.innerHTML += card;
            });
        } else {
            grid.innerHTML = '<div class="col-12"><p class="text-center text-muted">No projects found</p></div>';
        }
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

function loadTasks(content) {
    content.innerHTML = `
        <div class="dashboard-header">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h2 class="fw-bold">Task Management</h2>
                    <p class="text-muted">Organize and track your team's tasks</p>
                </div>
                <button class="btn btn-primary" onclick="showAddTaskModal()">
                    <i class="bi bi-plus-circle me-2"></i>Add Task
                </button>
            </div>
        </div>

        <div class="row g-4">
            <div class="col-md-4">
                <h5>To Do</h5>
                <div id="todoColumn" class="task-column"></div>
            </div>
            <div class="col-md-4">
                <h5>In Progress</h5>
                <div id="inProgressColumn" class="task-column"></div>
            </div>
            <div class="col-md-4">
                <h5>Completed</h5>
                <div id="completedColumn" class="task-column"></div>
            </div>
        </div>
    `;

    loadTasksData();
}

async function loadTasksData() {
    try {
        const { data: tasks, error } = await supabase
            .from('tasks')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const todoCol = document.getElementById('todoColumn');
        const inProgressCol = document.getElementById('inProgressColumn');
        const completedCol = document.getElementById('completedColumn');

        todoCol.innerHTML = '';
        inProgressCol.innerHTML = '';
        completedCol.innerHTML = '';

        if (tasks && tasks.length > 0) {
            tasks.forEach(task => {
                const taskCard = `
                    <div class="card mb-3 shadow-sm">
                        <div class="card-body">
                            <h6 class="card-title">${task.title}</h6>
                            <p class="card-text small text-muted">${task.description || ''}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="badge bg-${getPriorityColor(task.priority)}">${task.priority}</span>
                                <small class="text-muted">${task.due_date ? new Date(task.due_date).toLocaleDateString() : ''}</small>
                            </div>
                        </div>
                    </div>
                `;

                if (task.status === 'todo') {
                    todoCol.innerHTML += taskCard;
                } else if (task.status === 'in_progress') {
                    inProgressCol.innerHTML += taskCard;
                } else if (task.status === 'completed') {
                    completedCol.innerHTML += taskCard;
                }
            });
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

function loadSchedule(content) {
    content.innerHTML = `
        <div class="dashboard-header">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h2 class="fw-bold">Schedule & Calendar</h2>
                    <p class="text-muted">Manage meetings and events</p>
                </div>
                <button class="btn btn-primary" onclick="showAddEventModal()">
                    <i class="bi bi-plus-circle me-2"></i>New Event
                </button>
            </div>
        </div>

        <div class="card shadow-sm">
            <div class="card-body">
                <div id="scheduleList"></div>
            </div>
        </div>
    `;

    loadScheduleData();
}

async function loadScheduleData() {
    try {
        const { data: schedules, error } = await supabase
            .from('schedules')
            .select('*')
            .order('start_time', { ascending: true });

        if (error) throw error;

        const list = document.getElementById('scheduleList');
        list.innerHTML = '';

        if (schedules && schedules.length > 0) {
            schedules.forEach(schedule => {
                const eventCard = `
                    <div class="calendar-event bg-light">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <h6 class="mb-1">${schedule.title}</h6>
                                <p class="mb-1 small text-muted">${schedule.description || ''}</p>
                                <small class="text-muted">
                                    <i class="bi bi-clock"></i> ${new Date(schedule.start_time).toLocaleString()}
                                </small>
                            </div>
                            <span class="badge bg-primary">${schedule.event_type}</span>
                        </div>
                    </div>
                `;
                list.innerHTML += eventCard;
            });
        } else {
            list.innerHTML = '<p class="text-center text-muted">No scheduled events</p>';
        }
    } catch (error) {
        console.error('Error loading schedule:', error);
    }
}

function loadContentManager(content) {
    content.innerHTML = `
        <div class="dashboard-header">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h2 class="fw-bold">Social Media Content Manager</h2>
                    <p class="text-muted">Schedule and publish content across platforms</p>
                </div>
                <button class="btn btn-primary" onclick="showAddContentModal()">
                    <i class="bi bi-plus-circle me-2"></i>Create Post
                </button>
            </div>
        </div>

        <div class="row g-4 mb-4">
            <div class="col-md-3">
                <div class="card shadow-sm">
                    <div class="card-body text-center">
                        <i class="bi bi-facebook text-primary" style="font-size: 2rem;"></i>
                        <h6 class="mt-2">Facebook</h6>
                        <small class="text-muted" id="fbPosts">0 posts</small>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card shadow-sm">
                    <div class="card-body text-center">
                        <i class="bi bi-linkedin text-primary" style="font-size: 2rem;"></i>
                        <h6 class="mt-2">LinkedIn</h6>
                        <small class="text-muted" id="liPosts">0 posts</small>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card shadow-sm">
                    <div class="card-body text-center">
                        <i class="bi bi-youtube text-danger" style="font-size: 2rem;"></i>
                        <h6 class="mt-2">YouTube</h6>
                        <small class="text-muted" id="ytPosts">0 posts</small>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card shadow-sm">
                    <div class="card-body text-center">
                        <i class="bi bi-instagram" style="font-size: 2rem; color: #E1306C;"></i>
                        <h6 class="mt-2">Instagram</h6>
                        <small class="text-muted" id="igPosts">0 posts</small>
                    </div>
                </div>
            </div>
        </div>

        <div class="card shadow-sm">
            <div class="card-body">
                <div id="contentPostsList"></div>
            </div>
        </div>
    `;

    loadContentData();
}

async function loadContentData() {
    try {
        const { data: posts, error } = await supabase
            .from('content_posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const fbCount = posts?.filter(p => p.platform === 'facebook').length || 0;
        const liCount = posts?.filter(p => p.platform === 'linkedin').length || 0;
        const ytCount = posts?.filter(p => p.platform === 'youtube').length || 0;
        const igCount = posts?.filter(p => p.platform === 'instagram').length || 0;

        document.getElementById('fbPosts').textContent = `${fbCount} posts`;
        document.getElementById('liPosts').textContent = `${liCount} posts`;
        document.getElementById('ytPosts').textContent = `${ytCount} posts`;
        document.getElementById('igPosts').textContent = `${igCount} posts`;

        const list = document.getElementById('contentPostsList');
        list.innerHTML = '';

        if (posts && posts.length > 0) {
            const tableHTML = `
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Platform</th>
                                <th>Status</th>
                                <th>Scheduled</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${posts.map(post => `
                                <tr>
                                    <td>${post.title}</td>
                                    <td><span class="badge bg-primary">${post.platform}</span></td>
                                    <td><span class="badge bg-${getStatusColor(post.status)}">${post.status}</span></td>
                                    <td>${post.scheduled_time ? new Date(post.scheduled_time).toLocaleString() : '-'}</td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary">
                                            <i class="bi bi-pencil"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
            list.innerHTML = tableHTML;
        } else {
            list.innerHTML = '<p class="text-center text-muted">No content posts found</p>';
        }
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

function loadEmailTemplates(content) {
    content.innerHTML = `
        <div class="dashboard-header">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h2 class="fw-bold">Email Templates</h2>
                    <p class="text-muted">Create and manage email templates</p>
                </div>
                <button class="btn btn-primary" onclick="showAddEmailTemplateModal()">
                    <i class="bi bi-plus-circle me-2"></i>New Template
                </button>
            </div>
        </div>

        <div class="row g-4" id="emailTemplatesGrid"></div>
    `;

    loadEmailTemplatesData();
}

async function loadEmailTemplatesData() {
    try {
        const { data: templates, error } = await supabase
            .from('email_templates')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const grid = document.getElementById('emailTemplatesGrid');
        grid.innerHTML = '';

        if (templates && templates.length > 0) {
            templates.forEach(template => {
                const card = `
                    <div class="col-md-6 col-lg-4">
                        <div class="card shadow-sm h-100">
                            <div class="card-body">
                                <h5 class="card-title">${template.name}</h5>
                                <p class="card-text"><strong>Subject:</strong> ${template.subject}</p>
                                <span class="badge bg-info">${template.category || 'General'}</span>
                                <div class="mt-3">
                                    <button class="btn btn-sm btn-outline-primary" onclick="viewTemplate('${template.id}')">
                                        <i class="bi bi-eye"></i> View
                                    </button>
                                    <button class="btn btn-sm btn-outline-success" onclick="useTemplate('${template.id}')">
                                        <i class="bi bi-send"></i> Use
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                grid.innerHTML += card;
            });
        } else {
            grid.innerHTML = '<div class="col-12"><p class="text-center text-muted">No email templates found</p></div>';
        }
    } catch (error) {
        console.error('Error loading email templates:', error);
    }
}

function loadProducts(content) {
    content.innerHTML = `
        <div class="dashboard-header">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h2 class="fw-bold">Product Management</h2>
                    <p class="text-muted">Manage your software products and services</p>
                </div>
                <button class="btn btn-primary" onclick="showAddProductModal()">
                    <i class="bi bi-plus-circle me-2"></i>Add Product
                </button>
            </div>
        </div>

        <div class="card shadow-sm">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover" id="productsTable">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Featured</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    loadProductsDataTable();
}

async function loadProductsDataTable() {
    try {
        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const tbody = document.querySelector('#productsTable tbody');
        tbody.innerHTML = '';

        if (products && products.length > 0) {
            products.forEach(product => {
                const row = `
                    <tr>
                        <td>${product.name}</td>
                        <td>${product.category_id || '-'}</td>
                        <td>$${product.price}</td>
                        <td><span class="badge bg-${product.is_active ? 'success' : 'secondary'}">${product.is_active ? 'Active' : 'Inactive'}</span></td>
                        <td>${product.is_featured ? '<i class="bi bi-star-fill text-warning"></i>' : ''}</td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary" onclick="editProduct('${product.id}')">
                                <i class="bi bi-pencil"></i>
                            </button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        } else {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No products found</td></tr>';
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function loadOrders(content) {
    content.innerHTML = `
        <div class="dashboard-header">
            <h2 class="fw-bold">Order Management</h2>
            <p class="text-muted">Track and manage customer orders</p>
        </div>

        <div class="card shadow-sm">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover" id="ordersTable">
                        <thead>
                            <tr>
                                <th>Order #</th>
                                <th>Customer</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Payment</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    loadOrdersData();
}

async function loadOrdersData() {
    try {
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const tbody = document.querySelector('#ordersTable tbody');
        tbody.innerHTML = '';

        if (orders && orders.length > 0) {
            orders.forEach(order => {
                const row = `
                    <tr>
                        <td>${order.order_number}</td>
                        <td>${order.customer_id || '-'}</td>
                        <td>$${order.total_amount}</td>
                        <td><span class="badge bg-${getStatusColor(order.status)}">${order.status}</span></td>
                        <td><span class="badge bg-${order.payment_status === 'paid' ? 'success' : 'warning'}">${order.payment_status}</span></td>
                        <td>${new Date(order.created_at).toLocaleDateString()}</td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary" onclick="viewOrder('${order.id}')">
                                <i class="bi bi-eye"></i>
                            </button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        } else {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No orders found</td></tr>';
        }
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

function loadTeam(content) {
    content.innerHTML = `
        <div class="dashboard-header">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h2 class="fw-bold">Team Management</h2>
                    <p class="text-muted">Manage your team members</p>
                </div>
                <button class="btn btn-primary" onclick="showAddTeamMemberModal()">
                    <i class="bi bi-plus-circle me-2"></i>Add Member
                </button>
            </div>
        </div>

        <div class="row g-4" id="teamGrid"></div>
    `;

    loadTeamData();
}

async function loadTeamData() {
    try {
        const { data: members, error } = await supabase
            .from('team_members')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const grid = document.getElementById('teamGrid');
        grid.innerHTML = '';

        if (members && members.length > 0) {
            members.forEach(member => {
                const card = `
                    <div class="col-md-6 col-lg-4">
                        <div class="card shadow-sm">
                            <div class="card-body text-center">
                                <div class="mb-3">
                                    <img src="${member.avatar_url || 'https://via.placeholder.com/100'}"
                                         class="rounded-circle"
                                         alt="${member.full_name}"
                                         width="100"
                                         height="100"
                                         style="object-fit: cover;">
                                </div>
                                <h5 class="card-title">${member.full_name}</h5>
                                <p class="text-muted mb-2">${member.role}</p>
                                <p class="small text-muted mb-2">${member.email}</p>
                                <span class="badge bg-${member.is_active ? 'success' : 'secondary'}">
                                    ${member.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </div>
                `;
                grid.innerHTML += card;
            });
        } else {
            grid.innerHTML = '<div class="col-12"><p class="text-center text-muted">No team members found</p></div>';
        }
    } catch (error) {
        console.error('Error loading team:', error);
    }
}

function getStatusColor(status) {
    const colors = {
        'new': 'primary',
        'active': 'success',
        'pending': 'warning',
        'completed': 'success',
        'closed': 'secondary',
        'draft': 'secondary',
        'published': 'success',
        'scheduled': 'info'
    };
    return colors[status] || 'secondary';
}

function getPriorityColor(priority) {
    const colors = {
        'low': 'info',
        'medium': 'warning',
        'high': 'danger'
    };
    return colors[priority] || 'secondary';
}

window.showAddLeadModal = function() { alert('Add Lead feature coming soon!'); };
window.showAddCustomerModal = function() { alert('Add Customer feature coming soon!'); };
window.showAddProjectModal = function() { alert('Add Project feature coming soon!'); };
window.showAddTaskModal = function() { alert('Add Task feature coming soon!'); };
window.showAddEventModal = function() { alert('Add Event feature coming soon!'); };
window.showAddContentModal = function() { alert('Create Content feature coming soon!'); };
window.showAddEmailTemplateModal = function() { alert('Add Email Template feature coming soon!'); };
window.showAddProductModal = function() { alert('Add Product feature coming soon!'); };
window.showAddTeamMemberModal = function() { alert('Add Team Member feature coming soon!'); };

document.addEventListener('DOMContentLoaded', async () => {
    const session = await checkAuth();
    if (!session) return;

    loadSection('overview');

    document.querySelectorAll('[data-section]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            loadSection(section);
        });
    });

    document.getElementById('logoutBtn')?.addEventListener('click', async (e) => {
        e.preventDefault();
        await supabase.auth.signOut();
        window.location.href = '/';
    });
});

export { supabase };