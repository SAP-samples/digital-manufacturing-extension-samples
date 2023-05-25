# Removing Leading Zeros

Step 1: Add a new template for removing Leading Zeros
```
<xsl:template name="removeLeadingZeros">
		<xsl:param name="original" />
		<xsl:variable name="originalString">
			<xsl:choose>
				<xsl:when test="$original!=''">
					<xsl:value-of select="normalize-space($original)" />
				</xsl:when>
			</xsl:choose>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="$originalString!=''">
				<xsl:value-of select="format-number(number($originalString), '#')" />
			</xsl:when>
		</xsl:choose>
</xsl:template>
```

Step 2: Call the template for Material String

```
<material>
    <xsl:choose>
        <xsl:when test="(string(../MATNR_LONG))">
            <xsl:call-template name="removeLeadingZeros">
	            <xsl:with-param name="original" select="../MATNR_LONG" />
	        </xsl:call-template>
        </xsl:when>
        <xsl:otherwise>
            <xsl:call-template name="removeLeadingZeros">
		        <xsl:with-param name="original" select="../MATNR" />
			</xsl:call-template>
        </xsl:otherwise>
    </xsl:choose>
</material>  
```

# Special Character Replacement 

Step 1: Add a new Template for special character replacement

```
<xsl:template name="addSpecialMaterial">
        <xsl:param name="material" />
        <xsl:variable name="single_quote"><xsl:text>'</xsl:text></xsl:variable>
        <xsl:variable name="materialString_formatted1" select="normalize-space($material)"/>
        <xsl:variable name="materialString_formatted2" select="replace($materialString_formatted1,'#','_')"/>
        <xsl:variable name="materialString_formatted3" select="replace($materialString_formatted2,'\?','_')"/>
        <xsl:variable name="materialString_formatted4" select="replace($materialString_formatted3,'%','_')"/>
        <xsl:variable name="materialString_formatted5" select="replace($materialString_formatted4,'/','_')"/>
        <xsl:variable name="materialString_formatted6" select="replace($materialString_formatted5,'-','_')"/>
        <xsl:variable name="materialString_formatted7" select="replace($materialString_formatted6,'&quot;','_')"/>
        <xsl:variable name="materialString_formatted8" select="replace($materialString_formatted7,'&lt;','_')"/>
        <xsl:variable name="materialString_formatted9" select="replace($materialString_formatted8,':','_')"/>
        <xsl:variable name="materialString_formatted10" select="replace($materialString_formatted9,$single_quote,'_')"/>
        <xsl:value-of select="$materialString_formatted10"/>
</xsl:template>
```

Step 2: Call the template for Material String

```
<material>
    <xsl:choose>
        <xsl:when test="(string(../MATNR_LONG))">
            <xsl:call-template name="addSpecialMaterial">
	            <xsl:with-param name="material" select="../MATNR_LONG" />
	        </xsl:call-template>
        </xsl:when>
        <xsl:otherwise>
            <xsl:call-template name="addSpecialMaterial">
		        <xsl:with-param name="material" select="../MATNR" />
			</xsl:call-template>
        </xsl:otherwise>
    </xsl:choose>
</material>  
```

Step 3: Adding a custom data field for actual value capture

```
<customFieldDTOList>
    <customFieldDTO>
        <attribute>MAT_NAME</attribute>
        <value>
            <xsl:choose>
                <xsl:when test="(string(../MATNR_LONG))">
                    <xsl:call-template name="addMaterial">
                        <xsl:with-param name="material" select="../MATNR_LONG"/>
                    </xsl:call-template>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:call-template name="addMaterial">
                        <xsl:with-param name="material" select="../MATNR"/>
                    </xsl:call-template>
                </xsl:otherwise>
            </xsl:choose>
        </value>
    </customFieldDTO>      
</customFieldDTOList>
```
