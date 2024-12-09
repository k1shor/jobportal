const Token = require('../models/TokenModel');
const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const crypto = require('crypto')
const nodemailer = require('nodemailer')

exports.UserSighUp = async (req, res) => {
    try {
        const { first_name, last_name, username, email, password, date_of_birth, gender } = req.body;

        console.log(first_name, last_name, username, email, password, date_of_birth, gender);

        // Check if username or email already exists
        let user = await User.findOne({ username: username });
        if (user) {
            return res.status(400).json({ Error: "Username already exists" });
        }

        user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).json({ Error: "Email already taken!" });
        }

        // Check if saltRounds is a valid number
        const saltRounds = parseInt(process.env.SALTROUNDS);
        if (isNaN(saltRounds)) {
            console.log("Invalid SALTROUNDS value. Please check your environment variable.");
            return res.status(500).json({ Error: "Internal server error. Invalid SALTROUNDS value." });
        }

        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Store the user in the database
        user = await User.create({
            first_name,
            last_name,
            username,
            email,
            password: hashedPassword, // Use the hashed password
            date_of_birth,
            gender,
        });

        const generatedToken = crypto.randomBytes(24).toString('hex')
        // generate verification token in email
        let token = await Token.create({
            user: user._id,
            token: generatedToken

        })
        if (!token) {
            return res.status(400).json({ Error: "Can't generate token for you!" })
        } else {
            // send token in mail
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,  //  email address 
                    pass: process.env.EMAIL_PASS   //  email password

                }
            });

            const sendEmailToUser = async (userEmail, subject, textContent, htmlContent) => {
                const mailOptions = {
                    from: process.env.EMAIL_USER,  // Sender email address (use environment variable for security)
                    to: userEmail,                 // Recipient's email address (user's email)
                    subject: subject,              // Subject of the email
                    text: textContent,             // Plain text content
                    html: htmlContent              // HTML content (optional)
                };

                try {
                    const info = await transporter.sendMail(mailOptions);
                    console.log('Email sent:', info.response);
                } catch (error) {
                    console.error('Error sending email:', error);
                }
            };

            const sendVerificationEmail = async (userEmail, token) => {
                const verificationUrl = `http://localhost:5000/verify-email?token=${token}`;

                const textContent = `Hello,\n\nPlease click the following link to verify your email address:\n${verificationUrl}`;
                const htmlContent = `
                    <p>Hello,</p>
                    <p>Please click the following link to verify your email address:</p>
                    <a href="${verificationUrl}">Verify Email</a>
                `;

                // Call the sendEmailToUser function to send the email
                await sendEmailToUser(userEmail, 'Verify Your Email Address', textContent, htmlContent);
            };

            // Example usage:
            sendVerificationEmail("rockykushwaha5295@gmail.com", generatedToken);

        }








        return res.status(200).json({ success: "User registered successfully" });
    } catch (error) {
        console.error("Error during user signup:", error);
        return res.status(500).json({ Error: "Internal server error" });
    }
};


// login to the user
exports.UserLogin = async (req, res) => {
    try {
        const { username, password } = req.body
        console.log(username, password)

        // check the username exist or not
        let user = await User.findOne({ username: username })
        if (user) {
            // check the userpassword 
            bcrypt.compare(password, user.password, (error, result) => {
                if (result) {
                    // save the user information to localstorage
                    return res.status(200).json({ success: "You are logged in!" })

                } else {
                    return res.status(400).json({ Error: "password wrong!" })
                }
            })
        } else {
            return res.status(400).json({ Error: "Username don't exists!" })
        }

        // return res.status(400).json({ Error: "some error occured" })

    } catch (error) {
        return res.status(200).json({ Error: "Internal server error!" })
    }
}
