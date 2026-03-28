<!-- Waitlist Integration Script -->
<script>
// 动态加载等待列表表单
async function loadWaitlistForm() {
    try {
        const response = await fetch('http://localhost:8086/waitlist-form.html');
        if (response.ok) {
            const html = await response.text();
            const waitlistSection = document.getElementById('waitlist-section');
            if (waitlistSection) {
                waitlistSection.innerHTML = html;
            }
        }
    } catch (error) {
        console.log('等待列表表单加载失败，使用本地版本');
    }
}

// 页面加载完成后加载表单
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadWaitlistForm);
} else {
    loadWaitlistForm();
}
</script>
