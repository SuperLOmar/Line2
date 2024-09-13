const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
  EmbedBuilder,
} = require("discord.js");
const express = require("express");
const app = express();

// Keep Glitch project alive with express
app.get("/", (req, res) => {
  res.send("Bot is running");
});
app.listen(process.env.PORT);

// Create a new client instance with necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

let storedPrefix = "-"; // To store the prefix
let storedLine = "https://cdn.discordapp.com/attachments/1282059025848209588/1283297122464038932/Untitled_design_2.png?ex=66e47554&is=66e323d4&hm=a750147d0136b523392320fdb2bdff56584c49ae2976870d689747de7d466f2a&"; // To store the URL or attachment
let allowedRoles = new Set(); // To store allowed roles

// Register slash commands
const commands = [
  new SlashCommandBuilder()
    .setName("setline")
    .setDescription("Set a line (either an attachment or URL)")
    .addStringOption((option) =>
      option.setName("url").setDescription("Line URL").setRequired(true),
    ),

  new SlashCommandBuilder()
    .setName("setpre")
    .setDescription("Set the prefix for the bot to listen for")
    .addStringOption((option) =>
      option.setName("prefix").setDescription("Line Prefix").setRequired(true),
    ),

  new SlashCommandBuilder()
    .setName("allow")
    .setDescription("Allow a role to use the bot")
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("To allow a role")
        .setRequired(true),
    ),

  new SlashCommandBuilder()
    .setName("unallow")
    .setDescription("Remove a role from allowed roles")
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("To unallow a role")
        .setRequired(true),
    ),

  new SlashCommandBuilder().setName("help").setDescription("List of commands"),
];

// Deploy the slash commands
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands("1283327928364695625"), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

// Event: Bot is ready
client.once("ready", () => {
  console.log("Bot is online!");
});

// Event: Interaction create (handles slash commands)
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "setline") {
    storedLine = interaction.options.getString("url"); // Updated to match the option name
    console.log(`Stored line updated to: ${storedLine}`); // Log the URL for debugging

    const embed = new EmbedBuilder()
      .setTitle("تم تغير الخط الى")
      .setColor(0x000000) // Changed color code to standard hex format
      .setImage(storedLine) // Set the image URL correctly from the variable
      .setFooter({
        text: "Crystal",
        iconURL:
          "https://cdn.discordapp.com/icons/1282047552333549682/3b056c37fceb333784b68178c7fe01a1.png?size=1024",
      });

    await interaction.reply({ embeds: [embed], ephemeral: false });
  } else if (commandName === "setpre") {
    storedPrefix = interaction.options.getString("prefix");
    const embed = new EmbedBuilder()
      .setTitle("تم تغير البريفكس الى")
      .setDescription(` \`${storedPrefix}\``)
      .setColor(0x000000) // Changed color code to standard hex format
      .setFooter({
        text: "Crystal",
        iconURL:
          "https://cdn.discordapp.com/icons/1282047552333549682/3b056c37fceb333784b68178c7fe01a1.png?size=1024",
      });

    await interaction.reply({ embeds: [embed], ephemeral: false });
  } else if (commandName === "allow") {
    const role = interaction.options.getRole("role");
    allowedRoles.add(role.id);

    const embed = new EmbedBuilder()
      .setTitle("Role Allowed")
      .setDescription(
        `تمت اضافة الرتبة <@&${role.id}> الى قائمة الرتب المسموحة `,
      )
      .setColor(0x000000) // Changed color code to standard hex format
      .setFooter({
        text: "Crystal",
        iconURL:
          "https://cdn.discordapp.com/icons/1282047552333549682/3b056c37fceb333784b68178c7fe01a1.png?size=1024",
      });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  } else if (commandName === "unallow") {
    const role = interaction.options.getRole("role");
    allowedRoles.delete(role.id);

    const embed = new EmbedBuilder()
      .setTitle("Role Removed")
      .setDescription(`تمت ازالة الرتبة <@&${role.id}> من قائمة الرتب المسموحة`)
      .setColor(0x000000) // Changed color code to standard hex format
      .setFooter({
        text: "Crystal",
        iconURL:
          "https://cdn.discordapp.com/icons/1282047552333549682/3b056c37fceb333784b68178c7fe01a1.png?size=1024",
      });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  } else if (commandName === "help") {
    const embed = new EmbedBuilder()
      .setTitle("اوامر البوت")
      .setDescription(
        `- </setpre:1> **: لتغير البريفكس**
- </setline:1> **: لتغير الخط**
- </allow:1> **: للسماح لرتبة باستخدام الخط**
- </unallow:1> **: لازالة رتبة من الرتب المسموحة**
- </help:1> **: لعرض هذه القائمة**
ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
### الاوامر الكتابية :
- **البريفكس** : \`${storedPrefix}\`
- **الخط** :`,
      )
      .setImage(storedLine) // Set the image URL correctly from the variable
      .setColor(0x000000) // Changed color code to standard hex format
      .setFooter({
        text: "Crystal",
        iconURL:
          "https://cdn.discordapp.com/icons/1282047552333549682/3b056c37fceb333784b68178c7fe01a1.png?size=1024",
      });

    await interaction.reply({ embeds: [embed], ephemeral: false });
  }
});

// Event: Message create (bot listens for messages starting with the stored prefix)
client.on("messageCreate", async (message) => {
  // Ignore bot's own messages
  if (message.author.bot) return;

  // Check if the message starts with the stored prefix
  if (storedPrefix && message.content.startsWith(storedPrefix)) {
    // Check if the message sender has one of the allowed roles
    if (
      allowedRoles.size === 0 ||
      message.member.roles.cache.some((role) => allowedRoles.has(role.id))
    ) {
      try {
        // Delete the user's message first
        await message.delete();

        // Send the stored line as a message in the same channel
        message.channel.send({
          content: storedLine,
          allowedMentions: { parse: [] },
        });
      } catch (error) {
        console.error("Error responding to message:", error);
      }
    }
  }
});

// Log in to Discord with your bot token
client.login(process.env.TOKEN);
