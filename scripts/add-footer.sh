#!/bin/bash

FOOTER='    <footer class="social-footer">
        <div class="container">
            <div class="social-links">
                <a href="https://open.weixin.qq.com/qr/code?username=gh_ba5b6bb6bd89"
                   target="_blank" class="social-link wechat" title="微信公众号" rel="noopener noreferrer">
                    <i class="fab fa-weixin"></i>
                </a>
                <a href="https://github.com/kuangketongxue" target="_blank" class="social-link github" title="GitHub" rel="noopener noreferrer">
                    <i class="fab fa-github"></i>
                </a>
                <a href="https://x.com/kuangketongxue" target="_blank" class="social-link x" title="X (前 Twitter)" rel="noopener noreferrer">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                </a>
            </div>
            <p class="copyright">© 2025 狂客·银河 版权所有</p>
        </div>
    </footer>'

# 添加到所有 HTML 文件
for file in index.html moments/index.html diary/index.html reading/index.html bookshelf/index.html ai-rss/index.html exam/index.html; do
    if [ -f "$file" ]; then
        # 检查是否已有 footer
        if ! grep -q "social-footer" "$file"; then
            # 在 </body> 前添加 footer
            sed -i "/<\/body>/i\\    $FOOTER" "$file"
            echo "已为 $file 添加 Footer"
        else
            echo "$file 已有 Footer，跳过"
        fi
    fi
done

echo "完成！"
