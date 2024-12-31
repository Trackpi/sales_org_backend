const User = require('../models/userModel');  // Assuming the user schema is stored in models/user.js

// Add new user using User.create method
const addUser = async (req, res) => {
  const image = req.file ? `/uploads/employees/${req.file.filename}` : undefined;

  try {
    const  data  = req.body;
    console.log(data)
    // Use User.create to directly create and save the new user
    const newUser = await User.create({
     ...data,
     ...(image && { image }),

    });

    res.status(201).json({ message: 'User added successfully', user: newUser });
  } catch (err) {
    res.status(400).json({ message: 'Error adding user', error: err.message });
  }
};

// Edit an existing user
const editUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const { name, email, phone, dob, blood, location, address, pinCode, city, country,password,id } = req.body;
    const image = req.file ? `/uploads/employees/${req.file.filename}` : undefined;

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },  // Assuming `id` is the unique identifier
      {
        name,
        email,
        id,
        password,
        phone,
        dob,
        blood,
        location,
        address,
        pinCode,
        city,
        country,
        ...(image && {image})
      },
      { new: true }  // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    res.status(400).json({ message: 'Error updating user', error: err.message });
  }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const deletedUser = await User.findOneAndDelete({ _id: userId });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting user', error: err.message });
  }
};

// Get a single user by ID
const getUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(400).json({ message: 'Error fetching user', error: err.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (err) {
    res.status(400).json({ message: 'Error fetching users', error: err.message });
  }
};





// Login user using employee ID and password
const loginUser = async (req, res) => {
  const { id, password } = req.body;

  try {
    // Find the user by employeeId
    const user = await User.findOne({ id });

    // If no user found
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the provided password with the stored password
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // If authentication is successful
    res.status(200).json({
      message: 'Login successful',
      user: {
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        // Include any other user details you want to return
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};

module.exports = { addUser, editUser, deleteUser, getUser, getAllUsers,loginUser };
