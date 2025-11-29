import { AdminLayout } from '../layouts/AdminLayout'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'

export function PrivacyView() {
  return (
    <AdminLayout>
      <div class="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 class="text-3xl font-bold">隐私政策</h1>
          <p class="text-muted-foreground mt-1">最后更新日期：2024年11月28日</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. 信息收集</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div>
              <h4 class="font-medium mb-2">1.1 您提供的信息</h4>
              <p class="text-muted-foreground text-sm leading-relaxed">
                当您注册账户、使用我们的服务或与我们联系时，我们可能会收集以下信息：
              </p>
              <ul class="text-muted-foreground text-sm mt-2 space-y-1 list-disc list-inside">
                <li>基本信息：姓名、邮箱地址、手机号码</li>
                <li>账户信息：用户名、密码（加密存储）</li>
                <li>组织信息：公司名称、部门、职位</li>
                <li>通信内容：您与我们的往来邮件或消息</li>
              </ul>
            </div>
            <div>
              <h4 class="font-medium mb-2">1.2 自动收集的信息</h4>
              <p class="text-muted-foreground text-sm leading-relaxed">
                当您使用我们的服务时，我们会自动收集某些信息：
              </p>
              <ul class="text-muted-foreground text-sm mt-2 space-y-1 list-disc list-inside">
                <li>设备信息：设备类型、操作系统、浏览器类型</li>
                <li>日志信息：访问时间、页面浏览记录、IP 地址</li>
                <li>Cookie 和类似技术收集的信息</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. 信息使用</CardTitle>
          </CardHeader>
          <CardContent class="prose prose-sm max-w-none">
            <p class="text-muted-foreground leading-relaxed mb-4">
              我们收集的信息将用于以下目的：
            </p>
            <ul class="text-muted-foreground text-sm space-y-2 list-disc list-inside">
              <li>提供、维护和改进我们的服务</li>
              <li>处理您的请求和响应您的询问</li>
              <li>发送服务通知和更新信息</li>
              <li>检测、预防和解决技术问题和安全问题</li>
              <li>进行数据分析以改善用户体验</li>
              <li>遵守法律法规的要求</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. 信息共享</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <p class="text-muted-foreground text-sm leading-relaxed">
              我们不会出售您的个人信息。我们仅在以下情况下共享您的信息：
            </p>
            <div>
              <h4 class="font-medium mb-2">3.1 经您同意</h4>
              <p class="text-muted-foreground text-sm leading-relaxed">
                在获得您明确同意的情况下，我们可能与第三方共享您的信息。
              </p>
            </div>
            <div>
              <h4 class="font-medium mb-2">3.2 服务提供商</h4>
              <p class="text-muted-foreground text-sm leading-relaxed">
                我们可能与帮助我们提供服务的第三方服务提供商共享信息，这些提供商受保密协议约束。
              </p>
            </div>
            <div>
              <h4 class="font-medium mb-2">3.3 法律要求</h4>
              <p class="text-muted-foreground text-sm leading-relaxed">
                当法律要求或为保护我们的权利、财产或安全时，我们可能披露您的信息。
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. 数据安全</CardTitle>
          </CardHeader>
          <CardContent class="prose prose-sm max-w-none">
            <p class="text-muted-foreground leading-relaxed">
              我们采取适当的技术和组织措施来保护您的个人信息免受未经授权的访问、使用或披露。
              这些措施包括但不限于数据加密、访问控制、安全审计等。然而，请注意没有任何传输或存储方法是完全安全的，
              我们无法保证绝对的安全性。
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Cookie 使用</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <p class="text-muted-foreground text-sm leading-relaxed">
              我们使用 Cookie 和类似技术来收集信息并改善您的体验。Cookie 是存储在您设备上的小型文本文件。
            </p>
            <div>
              <h4 class="font-medium mb-2">我们使用的 Cookie 类型：</h4>
              <ul class="text-muted-foreground text-sm space-y-1 list-disc list-inside">
                <li>必要 Cookie：用于网站的基本功能</li>
                <li>功能 Cookie：记住您的偏好设置</li>
                <li>分析 Cookie：帮助我们了解网站的使用情况</li>
              </ul>
            </div>
            <p class="text-muted-foreground text-sm leading-relaxed">
              您可以通过浏览器设置管理 Cookie 偏好，但禁用某些 Cookie 可能会影响网站功能。
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. 您的权利</CardTitle>
          </CardHeader>
          <CardContent class="prose prose-sm max-w-none">
            <p class="text-muted-foreground leading-relaxed mb-4">
              根据适用的数据保护法律，您可能享有以下权利：
            </p>
            <ul class="text-muted-foreground text-sm space-y-2 list-disc list-inside">
              <li>访问权：请求访问我们持有的关于您的个人信息</li>
              <li>更正权：请求更正不准确或不完整的信息</li>
              <li>删除权：在某些情况下请求删除您的个人信息</li>
              <li>限制处理权：请求限制对您个人信息的处理</li>
              <li>数据可携带权：请求以通用格式获取您的数据</li>
              <li>撤回同意权：随时撤回您之前给予的同意</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. 儿童隐私</CardTitle>
          </CardHeader>
          <CardContent class="prose prose-sm max-w-none">
            <p class="text-muted-foreground leading-relaxed">
              我们的服务不面向 16 岁以下的儿童。我们不会故意收集儿童的个人信息。
              如果您认为我们可能收集了儿童的信息，请立即联系我们，我们将采取措施删除该信息。
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. 隐私政策更新</CardTitle>
          </CardHeader>
          <CardContent class="prose prose-sm max-w-none">
            <p class="text-muted-foreground leading-relaxed">
              我们可能会不时更新本隐私政策。更新后的政策将在本页面发布，并注明更新日期。
              我们建议您定期查看本政策以了解任何变更。重大变更时，我们会通过适当方式通知您。
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. 联系我们</CardTitle>
          </CardHeader>
          <CardContent class="prose prose-sm max-w-none">
            <p class="text-muted-foreground leading-relaxed">
              如果您对本隐私政策有任何疑问或想要行使您的权利，请通过以下方式联系我们：
            </p>
            <ul class="text-muted-foreground text-sm mt-2 space-y-1">
              <li>邮箱：privacy@halolight.h7ml.cn</li>
              <li>网站：<a href="https://halolight.docs.h7ml.cn" class="text-primary hover:underline" target="_blank" rel="noopener">https://halolight.docs.h7ml.cn</a></li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default PrivacyView
