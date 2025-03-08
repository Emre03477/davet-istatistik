const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildMessages] });

const token = 'BOT_TOKENINIZ'; 


async function davetHesapla(x, y) {
    const z = await x.invites.fetch();
    let a = 0;
    let b = 0;

    z.forEach(c => {
        a += c.uses || 0;
        if (c.inviter && c.inviter.id === y) {
            b += c.uses || 0;
        }
    });

    return { a, b };
}

async function siralamaHesapla(x, y) {
    const z = await x.invites.fetch();
    const d = [];

    z.forEach(c => {
        if (c.inviter) {
            d.push({
                userId: c.inviter.id,
                uses: c.uses || 0,
            });
        }
    });

    d.sort((e, f) => f.uses - e.uses);
    const g = d.findIndex(c => c.userId === y) + 1;
    return g;
}

client.once('ready', () => {
    console.log(`Bot başlatıldı: ${client.user.tag}`);

    const komut = new SlashCommandBuilder()
        .setName('davet-istatistik')
        .setDescription('Davet istatistiklerini gösterir.');
    client.application.commands.create(komut);
});

client.on('interactionCreate', async interaction => {
    try {
        if (interaction.isCommand() && interaction.commandName === 'davet-istatistik') {
            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('🎉 Davet İstatistikleri')
                .setDescription('Aşağıdaki butona basarak istatistiklerinizi görüntüleyin.')
                .setFooter({ text: 'Ayran Code Share - discord.gg/altyapi' });

            const buton = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('istatistik_goster')
                        .setLabel('İstatistiklerimi Göster')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji('📊'),
                );

            await interaction.reply({ embeds: [embed], components: [buton] });
        }

        if (interaction.isButton() && interaction.customId === 'istatistik_goster') {
            const sunucu = interaction.guild;
            const kullaniciId = interaction.user.id;

            const { a, b } = await davetHesapla(sunucu, kullaniciId);
            const g = await siralamaHesapla(sunucu, kullaniciId);

            const istatistikEmbed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('📊 Davet İstatistikleriniz')
                .addFields(
                    { name: 'Toplam Davet', value: `${a} kişi`, inline: true },
                    { name: 'Sizin Davetleriniz', value: `${b} kişi`, inline: true },
                    { name: 'Sıralamanız', value: `#${g}`, inline: true },
                )
                .setFooter({ text: 'Ayran Code Share - discord.gg/altyapi' });

            await interaction.reply({ embeds: [istatistikEmbed], ephemeral: true });
        }
    } catch (error) {
        console.error('Hata:', error);
        await interaction.reply({ content: 'Hata oluştu. Lütfen tekrar deneyin.', ephemeral: true });
    }
});

client.login(token);