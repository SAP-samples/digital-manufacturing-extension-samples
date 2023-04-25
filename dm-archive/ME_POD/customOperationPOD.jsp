<%@page contentType="text/html;charset=UTF-8" %>
<%@page import="com.sap.xmii.system.SessionHandler" %>
<%@page import="com.sap.xmii.Illuminator.security.User" %>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
	    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
	    <%
			User user = SessionHandler.getUser(request);
		%>
		<title>Operation POD</title>
		<script id="sap-ui-bootstrap"
			src="https://sapui5.hana.ondemand.com/resources/sap-ui-core.js"
			data-sap-ui-theme="sap_fiori_3"
			data-sap-ui-resourceroots='{"com.sap.me.customOperationPOD": "./"}'
			data-sap-ui-compatVersion="edge"
			data-sap-ui-preload="async"
			data-sap-ui-libs="sap.m">
		</script>
		<link rel="stylesheet" type="text/css" href="css/style.css">
		<script>
			var requiredUserFirst = '<%= user.getFirstName() != null ? user.getFirstName() : ""%>'
			var requiredUserLast = '<%= user.getLastName() != null ? user.getLastName() : ""  %>'
			var requiredUserID = '<%=user.getName() %>'
			sap.ui.getCore().attachInit(function() {
				new sap.m.Shell({
					appWidthLimited: false,
					app: new sap.ui.core.ComponentContainer({
						height : "100%",
						name : "com.sap.me.customOperationPOD",
						settings: {
						      componentData: { "UserFirst" : requiredUserFirst ,
						    	  				"UserLast" : requiredUserLast,
						    	  				"UserID" : requiredUserID
						    	  			}
						    }
					})
				}).placeAt("content");
			});
		</script>
	</head>
	<body class="sapUiBody" id="content">
	</body>
</html>