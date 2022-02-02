const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const multer  = require('multer')
const path = require('path')
const storage = multer.diskStorage({
  destination:(req,file,cb) => {
    cb(null,'public')
  },
  filename:(req,file,cb)=> {
    console.log(file);
    cb(null,Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({ storage:storage })




// @route   POST api/contact
// @desc    Post route
// @access  Public

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("phone_number", "Phone number is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("country_code", "Country code is required").not().isEmpty(),
  ],
  async (req, res) => {
    const contact = [];
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      contact.push(req.body);
      res.json(contact);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   GET api/contact
// @desc    Get route
// @access  Public

// Test contacts for GET route
const contacts = [
  {
    id: "1",
    name: "jack",
    email: "jack@gmail.com",
    phone_number: "00000000",
    country_code: "1000000",
  },
  {
    id: "2",
    name: "tom",
    email: "tom@gmail.com",
    phone_number: "11111111",
    country_code: "2000000",
  },
  {
    id: "3",
    name: "elizabeth",
    email: "elizabeth@gmail.com",
    phone_number: "22222222",
    country_code: "3000000",
  },
];

router.get("/", async (req, res) => {
  res.json(contacts);
});

// @route   DELETE api/contact
// @desc    Delete route, since I am not connected to any database I will show the deletion just by deleting it from the array and
// it will delete according to the user id.
// @access  Public

router.delete("/:id", async (req, res) => {
  if (contacts.filter((contact) => contact.id === req.params.id).length === 0) {
    return res.status(400).json({ msg: "There is no user with this id" });
  }

  const index = contacts
    .map((contact) => {
      return contact.id;
    })
    .indexOf(req.params.id);
  contacts.splice(index, 1);
  res.json(contacts);
});

// @route   PUT api/contact/:id
// @desc    update route
// @access  Public

router.put("/:id", async (req, res) => {
  if (contacts.filter((contact) => contact.id === req.params.id).length === 0) {
    return res.status(400).json({ msg: "There is no user with this id" });
  }
  const { name, email, country_code, phone_number } = req.body;
  newContact = {
    id: req.params.id,
    name: name,
    country_code: country_code,
    phone_number: phone_number,
    email: email,
  };
  const foundIndex = contacts.findIndex(
    (contact) => contact.id == req.params.id
  );
  contacts[foundIndex] = newContact;
  res.json(contacts);
}); 

// @route   POST api/contact/favorite/:id
// @desc    Put route, as far as I understand your requests, creating a route to add contacts to favourites,
// I will add to favorites according to the contact's id
// @access  Public

const favoritesContacts = [];
router.post("/favorite/:id", async (req, res) => {
  if (
    favoritesContacts.filter((contact) => contact.id === req.params.id).length > 0 ) {
    return res.status(400).json({ msg: "You have already added to favorites" });
  }

  contacts
    .filter((contact) => contact.id === req.params.id)
    .map((isFavorite) => favoritesContacts.push(isFavorite));
  res.json(favoritesContacts);
});

// @route   POST api/contact/image
// @desc    Upload image route
// @access  Public

router.post('/image', upload.single('image'), (req,res) => {
  res.json({msg:'Uploaded image'})
})

module.exports = router;
