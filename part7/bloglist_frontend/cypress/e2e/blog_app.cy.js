describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");

    const user = {
      name: "Matti Luukkainen",
      username: "mluukkai",
      password: "salainen",
    };
    cy.request("POST", "http://localhost:3003/api/users/", user);

    cy.visit("http://localhost:3000");
  });

  it("Login form is shown", function () {
    cy.contains("Log in to application");
    cy.get("#username");
    cy.get("#password");
    cy.get("#login-button");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("#username").type("mluukkai");
      cy.get("#password").type("salainen");
      cy.get("#login-button").click();

      cy.contains("Matti Luukkainen logged in");
    });

    it("fails with incorrect credentials", function () {
      cy.get("#username").type("tester");
      cy.get("#password").type("testing");
      cy.get("#login-button").click();

      cy.get(".error")
        .should("contain", "wrong username or password")
        .and("have.css", "color", "rgb(255, 0, 0)")
        .and("have.css", "border-style", "solid");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({ username: "mluukkai", password: "salainen" });
    });

    it("A blog can be created", function () {
      cy.contains("create new blog").click();
      cy.get("#blog-title-input").type("a blog created by cypress");
      cy.get("#blog-author-input").type("cypress");
      cy.get("#blog-url-input").type("cypress.io");
      cy.get("#save-blog").click();

      cy.get(".success")
        .should(
          "contain",
          "a new blog a blog created by cypress by cypress added"
        )
        .and("have.css", "color", "rgb(0, 128, 0)")
        .and("have.css", "border-style", "solid");

      cy.contains("a blog created by cypress");
    });

    describe("When multiple blogs exist", function () {
      beforeEach(function () {
        cy.createBlog({
          title: "ml's blog",
          author: "anonymous",
          url: "test.io",
          likes: 9,
        });

        const user = {
          name: "Tester Testest",
          username: "tester",
          password: "testaaja",
        };

        cy.request("POST", "http://localhost:3003/api/users/", user);

        cy.login({ username: "tester", password: "testaaja" });

        cy.createBlog({
          title: "testing",
          author: "tester",
          url: "test.oi",
          likes: 6,
        });

        cy.login({ username: "mluukkai", password: "salainen" });
      });

      it("Users can like a blog", function () {
        cy.contains("ml's blog anonymous")
          .find("button")
          .contains("view")
          .click()
          .parent()
          .should("contain", "likes 9")
          .contains("like")
          .click()
          .parent()
          .should("contain", "likes 10")
          .and("not.contain", "likes 9");
      });

      it("Users can delete their own blog", function () {
        cy.contains("ml's blog anonymous")
          .find("button")
          .contains("view")
          .click()
          .parent()
          .contains("remove")
          .click();
        cy.contains("ml's blog anonymous").should("not.exist");
      });

      it("Users cannot delete other users' blogs", function () {
        cy.contains("testing tester")
          .find("button")
          .contains("view")
          .click()
          .parent()
          .should("not.contain", "remove");
      });

      it("Blogs are sorted by most likes descending", function () {
        cy.get(".blog").eq(0).should("contain", "ml's blog anonymous");
        cy.get(".blog").eq(1).should("contain", "testing tester");
      });

      it("Blogs are sorted and updated when liked", function () {
        cy.get(".blog").eq(0).should("contain", "ml's blog anonymous");
        cy.get(".blog").eq(1).should("contain", "testing tester");

        cy.contains("testing tester")
          .find("button")
          .contains("view")
          .click()
          .parent()
          .should("contain", "likes 6")
          .contains("like")
          .click()
          .click()
          .click()
          .click()
          .parent()
          .should("contain", "likes 10");

        cy.get(".blog").eq(0).should("contain", "testing tester");
        cy.get(".blog").eq(1).should("contain", "ml's blog anonymous");
      });
    });
  });
});
