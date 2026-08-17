const apiUrl = Cypress.env("API_URL") || "http://localhost:3000";
const runId = Date.now();

const testUser = {
  name: "Cypress Test User",
  email: `cypress-user-${runId}@example.com`,
  password: "Cypress123!",
};

const adminUser = {
  email: "admin@portfolio.local",
  password: "Admin123!",
};

function login(credentials) {
  cy.visit("/login");
  cy.get('input[type="email"]').type(credentials.email);
  cy.get('input[type="password"]').type(credentials.password);
  cy.contains("button", "Sign in").click();
}

function loginAsAdmin() {
  login(adminUser);
  cy.url().should("include", "/admin");
}

function fillLabel(label, value) {
  cy.contains("label", label).find("input").clear().type(value);
}

describe("Portfolio application", () => {
  before(() => {
    cy.request({
      method: "POST",
      url: `${apiUrl}/api/users`,
      body: testUser,
      failOnStatusCode: false,
    });
  });

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it("logs in as a normal user and redirects to Home", () => {
    login(testUser);

    cy.url().should("eq", `${Cypress.config("baseUrl")}/`);
    cy.contains("Welcome").should("be.visible");
    cy.get(".site-nav").should("not.contain", "Dashboard");
    cy.screenshot("user-home");
  });

  it("logs in as an admin and redirects to Dashboard", () => {
    loginAsAdmin();

    cy.contains("Portfolio dashboard").should("be.visible");
    cy.contains("Dashboard").should("be.visible");
    cy.screenshot("admin-dashboard");
  });

  it("allows the admin to create an education record", () => {
    loginAsAdmin();
    cy.contains("button", "Education").click();

    fillLabel("education", "Cypress Software Engineering Program");
    fillLabel("completion_date", "January 2025 - December 2026");
    fillLabel("location", "Centennial College, Toronto, Canada");
    cy.contains("label", "courses")
      .find("textarea")
      .type("Web Development, Testing with Cypress");

    cy.contains("button", "Add Education").click();
    cy.contains("Cypress Software Engineering Program").should("be.visible");
    cy.screenshot("admin-created-education");
  });

  it("allows the admin to create a project record", () => {
    loginAsAdmin();

    fillLabel("title", "Cypress Portfolio Testing Project");
    fillLabel("completion_date", "August 2026");
    fillLabel("location", "Toronto, Canada");
    cy.contains("label", "description")
      .find("textarea")
      .type("Automated end-to-end testing for the portfolio application.");
    cy.get('input[type="file"]').selectFile("src/assets/Capstone.jpg");

    cy.contains("button", "Add Project").click();
    cy.contains("Cypress Portfolio Testing Project").should("be.visible");
    cy.screenshot("admin-created-project");
  });

  it("saves a contact submitted through the public form", () => {
    const contact = {
      firstname: "Cypress",
      lastname: `Contact ${runId}`,
      email: `cypress-contact-${runId}@example.com`,
      message: "This message was created by the Cypress test.",
    };

    cy.visit("/contact");
    cy.get("#firstname").type(contact.firstname);
    cy.get("#lastname").type(contact.lastname);
    cy.get("#email").type(contact.email);
    cy.get("#message").type(contact.message);
    cy.contains("button", "Send Message").click();

    cy.contains("Message sent successfully.").should("be.visible");
    cy.screenshot("contact-submitted");
  });

  it("allows the admin to mark a contact as Seen", () => {
    const contact = {
      firstname: "Cypress",
      lastname: `Status ${runId}`,
      email: `cypress-status-${runId}@example.com`,
      message: "This contact will be marked as seen.",
    };

    cy.request({
      method: "POST",
      url: `${apiUrl}/api/contacts`,
      body: contact,
    });

    loginAsAdmin();
    cy.contains("button", "Contacts").click();

    cy.contains("h3", `${contact.firstname} ${contact.lastname}`)
      .parents("article")
      .within(() => {
        cy.contains("button", "Edit").click();
      });

    cy.get('input[type="checkbox"]').check();
    cy.contains("button", "Save changes").click();

    cy.contains("h3", `${contact.firstname} ${contact.lastname}`)
      .parents("article")
      .should("contain", "Seen");
    cy.screenshot("contact-marked-seen");
  });
});
