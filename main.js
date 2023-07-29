const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


let contacts = [];

class Contact {
  constructor(fullName, phoneNumber, email) {
    this.fullName = fullName;
    this.phoneNumber = phoneNumber;
    this.email = email;
  }

  saveToFile(contact) {
    fs.readFile("contacts.json", "utf8", (err, data) => {
      if (!err) {
        try {
          contacts = JSON.parse(data);
        } catch (err) {
          console.error("Error", err);
        }
      }

      contacts.push(contact);

      fs.writeFile(
        "contacts.json",
        JSON.stringify(contacts, null, 2),
        (err) => {
          if (err) {
            console.error("Error saving to file:", err);
          } else {
            console.log("Contact saved to file successfully.");
          }
        }
      );
    });
  }

  validatePhoneNumber(phoneNumber) {
    const trimmedPhoneNumber = phoneNumber.trim();
    if (
      trimmedPhoneNumber.startsWith("+374") &&
      /^\d+$/.test(trimmedPhoneNumber.slice(4))
    ) {
      return true;
    }
    return false;
  }

  validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  seeAllContact() {
    fs.readFile("contacts.json", "utf8", (err, data) => {
      if (err) {
        console.error("Error reading contacts data:", err);
        rl.close();
        return;
      }

      try {
        const contacts = JSON.parse(data);
        if (contacts.length === 0) {
          console.log("No contacts found.");
        } else {
          console.log("All Contacts:");
          contacts.forEach((contact) => {
            console.log(`Name: ${contact.fullName}`);
            console.log(`Phone: ${contact.phoneNumber}`);
            console.log(`Email: ${contact.email}`);
            console.log("---------------------");
          });
        }
      } catch (err) {
        console.error("Error parsing existing data:", err);
      }

      rl.close();
    });
  }

  addContactData() {
    rl.question("Please input fullName: ", (userFullName) => {
      const fullName = userFullName.trim();

      rl.question("Please input phone number: ", (userPhoneNumber) => {
        const phoneNumber = userPhoneNumber.trim();
        if (!this.validatePhoneNumber(phoneNumber)) {
          console.log("Invalid phone number. Please try again.");
          this.addContactData();
        } else {
          rl.question("Please input email: ", (userEmail) => {
            const email = userEmail.trim();
            if (!this.validateEmail(email)) {
              console.log("Invalid email. Please try again.");
              this.addContactData();
            } else {
              rl.close();

              const contact = new Contact(fullName, phoneNumber, email);

              this.saveToFile(contact);
            }
          });
        }
      });
    });
  }

  deleteContactData() {
    rl.question(
      "Please tell me which name contact you want to delete: ",
      (deleteContactName) => {
        fs.readFile("contacts.json", "utf8", (err, data) => {
          if (err) {
            console.error("Error reading contacts data:", err);
            rl.close();
            return;
          }

          try {
            const contacts = JSON.parse(data);
            const updatedContacts = contacts.filter(
              (contact) => contact.fullName !== deleteContactName
            );
            if (contacts.length === updatedContacts.length) {
              console.log("Contact not found. Nothing deleted.");
            } else {
              fs.writeFile(
                "contacts.json",
                JSON.stringify(updatedContacts, null, 2),
                (err) => {
                  if (err) {
                    console.error("Error saving contacts data:", err);
                  } else {
                    console.log("Contact deleted successfully.");
                  }
                }
              );
            }
          } catch (err) {
            console.error("Error parsing existing data:", err);
          }

          rl.close();
        });
      }
    );
  }

  editContact() {
    rl.question(
      "Please tell me the contact name you want to edit: ",
      (editData) => {
        fs.readFile("contacts.json", "utf8", (err, data) => {
          if (err) {
            console.error("Error reading contacts data:", err);
            rl.close();
            return;
          }

          try {
            let contacts = JSON.parse(data);
            const contactToEdit = contacts.find(
              (contact) => contact.fullName === editData
            );
            if (!contactToEdit) {
              console.log("Contact not found.");
              rl.close();
              return;
            }

            rl.question(
              "Please enter the new contact name: ",
              (newFullName) => {
                const updatedContact = {
                  ...contactToEdit,
                  fullName: newFullName.trim(),
                };
                contacts = contacts.map((contact) =>
                  contact === contactToEdit ? updatedContact : contact
                );

                fs.writeFile(
                  "contacts.json",
                  JSON.stringify(contacts, null, 2),
                  (err) => {
                    if (err) {
                      console.error("Error saving contacts data:", err);
                    } else {
                      console.log("Contact updated successfully.");
                    }
                    rl.close();
                  }
                );
              }
            );
          } catch (err) {
            console.error("Error parsing existing data:", err);
            rl.close();
          }
        });
      }
    );
  }

  searchContact() {
    rl.question("Please enter the name to search for: ", (searchName) => {
      fs.readFile("contacts.json", "utf8", (err, data) => {
        if (err) {
          console.error("Error reading contacts data:", err);
          rl.close();
          return;
        }

        try {
          const contacts = JSON.parse(data);
          const matchingContacts = contacts.filter((contact) =>
            contact.fullName.toLowerCase().includes(searchName.toLowerCase())
          );

          if (matchingContacts.length === 0) {
            console.log("No matching contacts found.");
          } else {
            console.log("Matching Contacts:");
            matchingContacts.forEach((contact) => {
              console.log(`Name: ${contact.fullName}`);
              console.log(`Phone: ${contact.phoneNumber}`);
              console.log(`Email: ${contact.email}`);
              console.log("---------------------");
            });
          }
        } catch (err) {
          console.error("Error parsing existing data:", err);
        }

        rl.close();
      });
    });
  }


 init() {
    rl.question(
      "please enter the numbers 1-5 by performing the following steps: \n 1-see the complete contact \n 2-add a contact \n 3-delete the contact you selected \n 4-modify the given contact \n 5-search for the information you need from the contact: ",
      (actions) => {
        if (actions.toLowerCase() === "end") {
          rl.close();
          return;
        }
  
        if (actions === "1") {
          this.seeAllContact();
        } else if (actions === "2") {
          this.addContactData();
        } else if (actions === "3") {
          this.deleteContactData();
        } else if (actions === "4") {
          this.editContact();
        } else if (actions === "5") {
          this.searchContact();
        } else {
          console.log("Invalid number, please input valid number");
        }
      }
    );
  }
  

}

const contact = new Contact();
contact.init();
