# Bitrise Automated APK Build Setup

## Quick Setup (5 minutes)

### Step 1: Connect GitHub to Bitrise
1. Go to https://bitrise.io
2. Click "Sign up" → "GitHub" (or log in if you have an account)
3. Authorize Bitrise to access your GitHub repositories

### Step 2: Add Your Repository
1. Click "Create new app"
2. Select "GitHub"
3. Find and select `auravoice-mobile` repository
4. Click "Next"

### Step 3: Configure Build
1. Select branch: `main`
2. Bitrise will auto-detect React Native project
3. Click "Next"
4. Review settings and click "Create app"

### Step 4: Start Building
1. Go to your app dashboard
2. Click "Build" button
3. Wait 5-10 minutes for APK to build
4. Download APK from "Artifacts" section

## Automatic Builds

Once set up, every time you push to `main` branch:
- ✅ Bitrise automatically builds APK
- ✅ APK is available in Artifacts
- ✅ You get a build notification
- ✅ Share the download link with your client

## Download APK for Client

1. Go to your Bitrise app dashboard
2. Click latest "Build"
3. Scroll to "Artifacts"
4. Download the `.apk` file
5. Share the link with your client

## Free Tier Limits

- ✅ 200 builds/month
- ✅ 10 concurrent builds
- ✅ Unlimited storage
- Perfect for testing and small teams

## Troubleshooting

**Build fails?**
- Check build logs in Bitrise dashboard
- Ensure `bitrise.yml` is in repository root
- Verify Android SDK is properly configured

**APK not found?**
- Check "Artifacts" tab in build details
- Ensure build completed successfully
- Check logs for gradle errors

## Next Steps

1. Push code to GitHub
2. Go to https://bitrise.io and connect your repo
3. Start first build
4. Download and test APK on your phone
5. Share with client!

## Support

For issues:
- Check Bitrise docs: https://devcenter.bitrise.io/
- Review build logs in dashboard
- Check GitHub Actions for alternative approach
