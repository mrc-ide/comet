plugins {
    val kotlinVersion = "1.4.32"
    kotlin("jvm") version kotlinVersion
    kotlin("plugin.spring") version kotlinVersion
    id("org.springframework.boot") version "2.4.4"
    id("io.spring.dependency-management") version "1.0.11.RELEASE"
    id("io.gitlab.arturbosch.detekt") version "1.16.0"
    application
    jacoco
}

repositories {
    jcenter()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("com.github.kittinunf.fuel:fuel:2.3.1")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("net.logstash.logback:logstash-logback-encoder:6.6")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.mockito.kotlin:mockito-kotlin:3.1.0")
    testImplementation("org.leadpony.justify:justify:1.1.0")
    testImplementation("org.leadpony.joy:joy:1.1.0")
    testImplementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.12.3")
    developmentOnly("org.springframework.boot:spring-boot-devtools")
    detektPlugins("io.gitlab.arturbosch.detekt:detekt-formatting:1.16.0")
}

detekt {
    config = files("$rootDir/config/detekt.yml")
    buildUponDefaultConfig = true
}

tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
    kotlinOptions {
        freeCompilerArgs = listOf("-Xjsr305=strict")
        jvmTarget = "1.8"
    }
}

tasks.withType<io.gitlab.arturbosch.detekt.Detekt> {
    jvmTarget = "1.8"
}

tasks.withType<Test> {
    useJUnitPlatform()
}

tasks.jacocoTestReport {
    reports {
        xml.isEnabled = true
    }
}

tasks.processResources {
    dependsOn("compileFrontEnd")
}

tasks.bootRun {
    sourceResources(sourceSets["main"])
}

task<Exec>("compileFrontEnd") {
    commandLine("npm", "run", "build", "--prefix=$projectDir/static/")
}

application {
    mainClass.set("org.imperial.mrc.comet.ApplicationKt")
}
